import secureStorage from '../services/secure-storage.js';

const visibilityStore = new EventTarget();

// Chave criptografada fixa
const ENCRYPTED_KEY = 'showValues';


let showValues = true; // Valor padrão inicial

// Inicialização assíncrona
(async function initialize() {
  try {
    const stored = await secureStorage.getItem(localStorage, ENCRYPTED_KEY);


    if (stored !== null) {
      showValues = Boolean(stored);
    }
  } catch (error) {
    console.error('Erro ao recuperar visibilidade:', error);
    // Mantém o valor padrão em caso de erro
  }
})();

export function getShowValues() {
  return showValues;
}

export async function toggleShowValues() {
  try {
    showValues = !showValues;
    await secureStorage.setItem(localStorage, ENCRYPTED_KEY, Boolean(showValues));
    visibilityStore.dispatchEvent(new Event('change'));
  } catch (error) {
    console.error('Erro ao alternar visibilidade:', error);
  }
}

export function subscribeToVisibility(callback) {
  visibilityStore.addEventListener('change', callback);
}

export function unsubscribeFromVisibility(callback) {
  visibilityStore.removeEventListener('change', callback);
}
