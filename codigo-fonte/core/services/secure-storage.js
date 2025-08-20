import cryptoService from './crypto.js';
import toast from './toast.js';

class SecureStorage {
  constructor() {
    this.initialized = false;
    this.encryptedKeys = new Map();
  }

  // Inicializa o serviço e gera as chaves criptografadas
  async initialize() {
    if (this.initialized) return;

    try {
      // Gera chaves criptografadas para os nomes das propriedades
      this.encryptedKeys.set('data', await cryptoService.generateDeterministicKey('data'));
      this.initialized = true;
    } catch (error) {
      console.error('Erro ao inicializar secure storage:', error);
      toast.error('Erro ao inicializar armazenamento seguro. Por favor, recarregue a página.');
      throw error;
    }
  }

  // Métodos para localStorage e sessionStorage
  async setItem(storage, key, value) {
    try {
      await this.initialize();
      const encryptedKey = await cryptoService.generateDeterministicKey(key);
      const encryptedValue = await cryptoService.encrypt(value);
      storage.setItem(encryptedKey, encryptedValue);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      toast.error('Erro ao salvar dados. Por favor, tente novamente.');
      throw error;
    }
  }

  async getItem(storage, key) {
    try {
      await this.initialize();
      const encryptedKey = await cryptoService.generateDeterministicKey(key);
      const encryptedValue = storage.getItem(encryptedKey);
      if (!encryptedValue) return null;
      return await cryptoService.decrypt(encryptedValue);
    } catch (error) {
      console.error('Erro ao recuperar item:', error);
      toast.error('Erro ao recuperar dados. Por favor, tente novamente.');
      throw error;
    }
  }

  async removeItem(storage, key) {
    try {
      await this.initialize();
      const encryptedKey = await cryptoService.generateDeterministicKey(key);
      storage.removeItem(encryptedKey);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast.error('Erro ao remover dados. Por favor, tente novamente.');
      throw error;
    }
  }

  // Métodos para IndexedDB
  async openDB(dbName, storeName, version = 1) {
    await this.initialize();
    const s = await cryptoService.generateDeterministicKey(storeName);

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(s)) {
          db.createObjectStore(s, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        toast.error('Erro ao abrir banco de dados. Por favor, recarregue a página.');
        reject(request.error);
      };
    });
  }

  async saveToIndexedDB(dbName, storeName, data) {
    try {
      await this.initialize();
      const s = await cryptoService.generateDeterministicKey(storeName);
      const db = await this.openDB(dbName, storeName);
      const encryptedDataKey = this.encryptedKeys.get('data');
      const encryptedData = await cryptoService.encrypt(data);

      const itemToSave = {
        id: data.id,
        [encryptedDataKey]: encryptedData,
      };

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(s, 'readwrite');
        const store = transaction.objectStore(s);
        const request = store.put(itemToSave);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          toast.error('Erro ao salvar no banco de dados. Por favor, tente novamente.');
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Erro ao salvar no IndexedDB:', error);
      toast.error('Erro ao salvar no banco de dados. Por favor, tente novamente.');
      throw error;
    }
  }

  async getAllFromIndexedDB(dbName, storeName) {
    try {
      await this.initialize();
      const s = await cryptoService.generateDeterministicKey(storeName);
      const db = await this.openDB(dbName, storeName);
      const encryptedDataKey = this.encryptedKeys.get('data');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(s, 'readonly');
        const store = transaction.objectStore(s);
        const request = store.getAll();

        request.onsuccess = async () => {
          try {
            const decryptedItems = await Promise.all(
              request.result.map(async (item) => {
                return await cryptoService.decrypt(item[encryptedDataKey]);
              })
            );
            resolve(decryptedItems);
          } catch (error) {
            toast.error('Erro ao descriptografar dados. Por favor, tente novamente.');
            reject(error);
          }
        };

        request.onerror = () => {
          toast.error('Erro ao recuperar dados do banco. Por favor, tente novamente.');
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Erro ao recuperar do IndexedDB:', error);
      toast.error('Erro ao recuperar dados do banco. Por favor, tente novamente.');
      throw error;
    }
  }

  async getFromIndexedDB(dbName, storeName, id, version = 1) {
    try {
      await this.initialize();
      const s = await cryptoService.generateDeterministicKey(storeName);
      const db = await this.openDB(dbName, storeName, version);
      const encryptedDataKey = this.encryptedKeys.get('data');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(s, 'readonly');
        const store = transaction.objectStore(s);
        const request = store.get(id);

        request.onsuccess = async () => {
          try {
            const item = request.result;
            if (!item) {

              resolve(null);
              return;
            }
            const decrypted = await cryptoService.decrypt(item[encryptedDataKey]);
            resolve(decrypted);
          } catch (error) {
            toast.error('Erro ao descriptografar o item. Por favor, tente novamente.');
            reject(error);
          }
        };

        request.onerror = () => {
          toast.error('Erro ao recuperar item do banco. Por favor, tente novamente.');
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Erro ao recuperar item do IndexedDB:', error);
      toast.error('Erro ao recuperar item do banco. Por favor, tente novamente.');
      throw error;
    }
  }

  async deleteFromIndexedDB(dbName, storeName, id) {
    try {
      await this.initialize();
      const s = await cryptoService.generateDeterministicKey(storeName);
      const db = await this.openDB(dbName, storeName);

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(s, 'readwrite');
        const store = transaction.objectStore(s);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          toast.error('Erro ao excluir do banco de dados. Por favor, tente novamente.');
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Erro ao deletar do IndexedDB:', error);
      toast.error('Erro ao excluir do banco de dados. Por favor, tente novamente.');
      throw error;
    }
  }
}

// Exporta uma única instância do serviço
export default new SecureStorage();
