import toast from './toast.js';
import { generateUUID } from '../utils/generate.js';
class CryptoService {
  constructor() {
    this.initialized = false;
    this.key = null;
    this.deviceUUID = null;
    this.deviceKeyName = null;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      let deviceInfo = localStorage.getItem('savemoney_device_info');
      let deviceUUID = localStorage.getItem('savemoney_device_uuid');

      if (!deviceInfo) {
        deviceInfo = [
          'SaveMoney',
          navigator.platform,
          navigator.vendor,
          navigator.productSub,
          navigator.userAgentData?.platform || '',
          'PUC_MINAS'
        ].join('|');
        localStorage.setItem('savemoney_device_info', deviceInfo);
      }

      if (!deviceUUID) {
        deviceUUID = generateUUID();
        localStorage.setItem('savemoney_device_uuid', deviceUUID);
      }

      this.deviceUUID = deviceUUID;
      this.deviceKeyName = `savemoney_data_${deviceUUID}`;
      const encoder = new TextEncoder();
      const combined = `${deviceInfo}|${deviceUUID}`;
      const data = encoder.encode(combined);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      this.key = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      this.initialized = true;
    } catch (error) {
      console.error('Erro ao inicializar serviço de criptografia:', error);
      toast.error('Erro ao inicializar criptografia. Por favor, recarregue a página.');
      throw error;
    }
  }

  // Método para gerar uma chave determinística
  async generateDeterministicKey(input) {
    try {
      await this.initialize();
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Erro ao gerar chave determinística:', error);
      toast.error('Erro ao gerar chave de criptografia. Por favor, tente novamente.');
      throw error;
    }
  }

  // Método para criptografar dados
  async encrypt(data) {
    try {
      await this.initialize();
      const encoder = new TextEncoder();
      const jsonString = JSON.stringify(data);
      const dataBuffer = encoder.encode(jsonString);

      // Gera um IV aleatório
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Importa a chave
      const keyBuffer = new Uint8Array(this.key.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      // Criptografa os dados
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        cryptoKey,
        dataBuffer
      );

      // Combina o IV com os dados criptografados
      const result = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      result.set(iv);
      result.set(new Uint8Array(encryptedBuffer), iv.length);

      // Converte para base64
      return btoa(String.fromCharCode.apply(null, result));
    } catch (error) {
      console.error('Erro ao criptografar dados:', error);
      toast.error('Erro ao criptografar dados. Por favor, tente novamente.');
      throw error;
    }
  }

  // Método para descriptografar dados
  async decrypt(encryptedData) {
    try {
      await this.initialize();

      // Converte de base64 para Uint8Array
      const encryptedArray = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

      // Extrai o IV (primeiros 12 bytes)
      const iv = encryptedArray.slice(0, 12);
      const data = encryptedArray.slice(12);

      // Importa a chave
      const keyBuffer = new Uint8Array(this.key.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      // Descriptografa os dados
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        cryptoKey,
        data
      );

      // Converte de volta para string e depois para objeto
      const decoder = new TextDecoder();
      const jsonString = decoder.decode(decryptedBuffer);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Erro ao descriptografar dados:', error);
      toast.error('Erro ao descriptografar dados. Por favor, tente novamente.');
      throw error;
    }
  }
}

// Exporta uma única instância do serviço
export default new CryptoService();
