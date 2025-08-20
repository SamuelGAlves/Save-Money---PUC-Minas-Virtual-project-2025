import cryptoService from './crypto.js';
import secureStorage from './secure-storage.js';
import toast from './toast.js';

export const DB_NAME = await cryptoService.generateDeterministicKey('SaveMoney:users');
export const STORE_NAME = 'users';
export const AUTH_KEY = 'auth_user';
export const VERSION_DB = 1;

class AuthService {
  constructor() {
    this.initialized = false;
    this.encryptedKeys = new Map();
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.encryptedKeys.set('data', await cryptoService.generateDeterministicKey('data'));
      this.initialized = true;
    } catch (error) {
      console.error('Erro ao inicializar secure storage:', error);
      toast.error('Erro ao inicializar armazenamento seguro. Por favor, recarregue a página.');
      throw error;
    }
  }

  async encryptEmail(email) {
    if (!email) return null;
    return await cryptoService.generateDeterministicKey(email);
  }

  async login(email, password) {
    try {

      const user = await this.getUser(email);



      if (!user || user.senha !== password) {
        return { success: false, message: 'Usuário ou senha inválidos' };
      }



      await secureStorage.setItem(localStorage, AUTH_KEY, {
        user: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          documento: user.documento,
          termos: user.termos,
        },
        token: crypto.randomUUID(),
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          documento: user.documento,
          termos: user.termos,
        },
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro ao processar login. Tente novamente.' };
    }
  }

  async logout() {
    try {
      await secureStorage.removeItem(localStorage, AUTH_KEY);
      // Adiciona um pequeno delay para melhor UX
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
      throw error;
    }
  }

  async getLoggedUser() {
    try {
      return await secureStorage.getItem(localStorage, AUTH_KEY);
    } catch (error) {
      console.error('Erro ao obter usuário autenticado:', error);
      return null;
    }
  }

  async isAuthenticated() {
    const user = await this.getLoggedUser();
    return !!user;
  }

  async openDB() {
    await this.initialize();
    const storeName = await cryptoService.generateDeterministicKey(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, VERSION_DB);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        let store;
        if (!db.objectStoreNames.contains(storeName)) {
          store = db.createObjectStore(storeName, { keyPath: 'id' });
        } else {
          store = request.transaction.objectStore(storeName);
        }

        if (!store.indexNames.contains('by_index_secret')) {
          store.createIndex('by_index_secret', 'index_secret', { unique: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        toast.error('Erro ao abrir banco de dados. Por favor, recarregue a página.');
        reject(request.error);
      };
    });
  }

  async saveUser(user) {
    try {
      await this.initialize();
      const storeName = await cryptoService.generateDeterministicKey(STORE_NAME);
      const db = await this.openDB();
      const encryptedDataKey = this.encryptedKeys.get('data');
      const encryptedData = await cryptoService.encrypt(user);
      const encryptedEmail = await this.encryptEmail(user.email);

      const itemToSave = {
        id: user.id,
        index_secret: encryptedEmail,
        [encryptedDataKey]: encryptedData,
      };

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const index = store.index('by_index_secret');

        const getRequest = index.get(encryptedEmail);

        getRequest.onsuccess = async () => {
          const existing = getRequest.result;

          if (existing && existing.id !== user.id) {
            toast.error('Este e-mail já está em uso por outro usuário.');
            return reject(new Error('Email já cadastrado.'));
          }

          const putRequest = store.put(itemToSave);

          putRequest.onsuccess = async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));
            resolve();
          };
          putRequest.onerror = () => {
            toast.error('Erro ao salvar usuário no banco de dados.');
            reject(putRequest.error);
          };
        };

        getRequest.onerror = () => {
          toast.error('Erro ao verificar index_secret do usuário.');
          reject(getRequest.error);
        };
      });
    } catch (error) {
      console.error('Erro ao salvar usuário no IndexedDB:', error);
      toast.error('Erro ao salvar usuário no banco de dados.');
      throw error;
    }
  }

  async updateUser(user) {
    try {
      await this.initialize();
      const storeName = await cryptoService.generateDeterministicKey(STORE_NAME);
      const db = await this.openDB();
      const encryptedDataKey = this.encryptedKeys.get('data');

      const encryptedData = await cryptoService.encrypt(user);
      const encryptedEmail = await this.encryptEmail(user.email);

      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('by_index_secret');

      // Busca registro existente pelo encryptedEmail (index_secret)
      const existingUser = await new Promise((resolve, reject) => {
        const request = index.get(encryptedEmail);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Se encontrou registro existente, atualize ele (mesmo se user.id for diferente)
      const idToUse = existingUser ? existingUser.id : user.id;

      const itemToUpdate = {
        id: idToUse,
        index_secret: encryptedEmail,
        [encryptedDataKey]: encryptedData,
      };

      // Atualiza o registro
      return new Promise((resolve, reject) => {
        const putRequest = store.put(itemToUpdate);

        putRequest.onsuccess = async () => {
          await new Promise(resolve => setTimeout(resolve, 1500));
          resolve();
        };
        putRequest.onerror = () => {
          toast.error('Erro ao atualizar o usuário.');
          reject(putRequest.error);
        };
      });

    } catch (error) {
      console.error('Erro ao atualizar usuário no IndexedDB:', error);
      toast.error('Erro ao atualizar os dados do usuário.');
      throw error;
    }
  }

  async getUser(email) {
    if (!email) {
      console.warn('Email não fornecido ao buscar usuário.');
      return null;
    }

    try {


      await this.initialize();
      const storeName = await cryptoService.generateDeterministicKey(STORE_NAME);
      const db = await this.openDB();
      const encryptedDataKey = this.encryptedKeys.get('data');
      const encryptedEmail = await this.encryptEmail(email);

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index('by_index_secret');
        const request = index.get(encryptedEmail);

        request.onerror = () => {
          console.error('Erro ao buscar usuário:', request.error);
          toast.error('Erro ao buscar usuário.');
          reject(request.error);
        };

        request.onsuccess = () => {
          const item = request.result;
          if (!item) {

            resolve(null);
            return;
          }

          cryptoService
            .decrypt(item[encryptedDataKey])
            .then((decrypted) => {

              resolve(decrypted);
            })
            .catch((error) => {
              console.error('Erro ao descriptografar o usuário:', error);
              toast.error('Erro ao descriptografar o usuário.');
              reject(error);
            });
        };
      });
    } catch (error) {
      console.error('Erro ao acessar IndexedDB:', error);
      toast.error('Erro ao acessar o banco.');
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await this.initialize();
      const storeName = await cryptoService.generateDeterministicKey(STORE_NAME);
      const db = await this.openDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const deleteRequest = store.delete(userId);

        deleteRequest.onsuccess = async () => {
          await new Promise(resolve => setTimeout(resolve, 1500));
          resolve();
        };

        deleteRequest.onerror = () => {
          toast.error('Erro ao deletar usuário.');
          reject(deleteRequest.error);
        };
      });
    } catch (error) {
      console.error('Erro ao deletar usuário no IndexedDB:', error);
      toast.error('Erro ao deletar os dados do usuário.');
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {


      const storedTokenData = await secureStorage.getItem(localStorage, 'recovery_token');
      if (!storedTokenData) {
        console.error('Token não encontrado no localStorage');
        return false;
      }

      const { token: storedToken, expires } = JSON.parse(storedTokenData);
      if (token !== storedToken || Date.now() > expires) {
        console.error('Token inválido ou expirado');
        return false;
      }

      // Busca o usuário pelo token
      await this.initialize();
      const storeName = await cryptoService.generateDeterministicKey(STORE_NAME);
      const db = await this.openDB();
      const encryptedDataKey = this.encryptedKeys.get('data');

      // Busca todos os usuários para encontrar o que tem o token
      const users = await new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onerror = () => {
          console.error('Erro ao buscar usuários:', request.error);
          reject(request.error);
        };

        request.onsuccess = async () => {
          try {
            const decryptedUsers = await Promise.all(
              request.result.map(async (item) => {
                return await cryptoService.decrypt(item[encryptedDataKey]);
              })
            );
            resolve(decryptedUsers);
          } catch (error) {
            console.error('Erro ao descriptografar usuários:', error);
            reject(error);
          }
        };
      });

      // Encontra o usuário com o token
      const user = users.find(u => u.recoveryToken === token);
      if (!user) {
        console.error('Usuário não encontrado com o token fornecido');
        return false;
      }



      // Atualiza a senha e remove o token
      user.senha = newPassword;
      user.recoveryToken = null;

      // Salva as alterações
      await this.updateUser(user);


      return true;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return false;
    }
  }

  async generateRecoveryToken(userId) {
    try {


      // Gera um token único usando crypto.randomUUID()
      const token = crypto.randomUUID();

      // Busca o usuário e atualiza o token
      const user = await this.getUserById(userId);
      if (!user) {
        console.error('Usuário não encontrado para gerar token');
        return null;
      }



      // Atualiza o usuário com o novo token
      user.recoveryToken = token;
      await this.updateUser(user);


      return token;
    } catch (error) {
      console.error('Erro ao gerar token de recuperação:', error);
      return null;
    }
  }

  async getUserById(userId) {
    try {


      await this.initialize();
      const storeName = await cryptoService.generateDeterministicKey(STORE_NAME);
      const db = await this.openDB();
      const encryptedDataKey = this.encryptedKeys.get('data');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(userId);

        request.onerror = () => {
          console.error('Erro ao buscar usuário por ID:', request.error);
          toast.error('Erro ao buscar usuário.');
          reject(request.error);
        };

        request.onsuccess = () => {
          const item = request.result;
          if (!item) {

            resolve(null);
            return;
          }

          cryptoService
            .decrypt(item[encryptedDataKey])
            .then((decrypted) => {

              resolve(decrypted);
            })
            .catch((error) => {
              console.error('Erro ao descriptografar o usuário:', error);
              toast.error('Erro ao descriptografar o usuário.');
              reject(error);
            });
        };
      });
    } catch (error) {
      console.error('Erro ao acessar IndexedDB:', error);
      toast.error('Erro ao acessar o banco.');
      throw error;
    }
  }
}

export default new AuthService();
