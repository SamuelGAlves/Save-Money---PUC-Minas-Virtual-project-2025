import { loaderService } from './loader.js';

// Cache local para taxas de câmbio
const exchangeRateCache = new Map();

// Lista de criptomoedas suportadas com seus IDs na CoinGecko
const CRYPTO_CURRENCIES = new Map([
  ['BTC', 'bitcoin'],
  ['ETH', 'ethereum'],
  ['BNB', 'binancecoin'],
  ['XRP', 'ripple'],
  ['ADA', 'cardano'],
  ['SOL', 'solana'],
  ['DOT', 'polkadot'],
  ['DOGE', 'dogecoin'],
  ['AVAX', 'avalanche-2'],
  ['MATIC', 'matic-network']
]);

// Subject para notificar mudanças nas taxas
class ExchangeRateSubject {
  constructor() {
    this.observers = new Map();
  }

  subscribe(key, callback) {
    if (!this.observers.has(key)) {
      this.observers.set(key, new Set());
    }
    this.observers.get(key).add(callback);
    return () => this.unsubscribe(key, callback);
  }

  unsubscribe(key, callback) {
    if (this.observers.has(key)) {
      this.observers.get(key).delete(callback);
    }
  }

  notify(key, data) {
    if (this.observers.has(key)) {
      this.observers.get(key).forEach(callback => callback(data));
    }
  }
}

const exchangeRateSubject = new ExchangeRateSubject();

// Função para obter a última data útil
function getLastBusinessDay(date = new Date()) {
  const day = date.getDay();
  if (day === 0) { // Domingo
    date.setDate(date.getDate() - 2);
  } else if (day === 6) { // Sábado
    date.setDate(date.getDate() - 1);
  }
  return date;
}

// Função para formatar a data no formato YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Função para gerar chave do cache
function generateCacheKey(fromCurrency, toCurrency, date) {
  return `${date}-${fromCurrency}-${toCurrency}`;
}

// Função para verificar se é uma criptomoeda
function isCryptoCurrency(currency) {
  return CRYPTO_CURRENCIES.has(currency.toUpperCase());
}

// Função para obter o ID da CoinGecko para uma criptomoeda
function getCoinGeckoId(currency) {
  return CRYPTO_CURRENCIES.get(currency.toUpperCase());
}

// Função para formatar o valor com o número correto de casas decimais
function formatValue(value, currency) {
  if (value === null || isNaN(value)) return null;

  // Se for uma criptomoeda
  if (isCryptoCurrency(currency)) {
    // Para valores muito pequenos (menores que 0.0001), mostra mais casas decimais
    if (value < 0.0001) {
      return Number(value.toFixed(8));
    }
    // Para valores pequenos (menores que 1), mostra 6 casas decimais
    else if (value < 1) {
      return Number(value.toFixed(6));
    }
    // Para valores maiores, mostra 4 casas decimais
    else {
      return Number(value.toFixed(4));
    }
  }

  // Para moedas tradicionais, mantém 2 casas decimais
  return Number(value.toFixed(2));
}

// Função para obter uma taxa de câmbio reativa
export function getReactiveExchangeRate(fromCurrency, toCurrency) {
  const today = new Date();
  const lastBusinessDay = getLastBusinessDay(today);
  const formattedDate = formatDate(lastBusinessDay);
  const cacheKey = generateCacheKey(fromCurrency, toCurrency, formattedDate);

  return new Promise((resolve) => {
    // Se já temos a taxa em cache, resolve imediatamente
    if (exchangeRateCache.has(cacheKey)) {
      resolve(exchangeRateCache.get(cacheKey));
    }

    // Busca a taxa e se inscreve para atualizações
    fetchExchangeRate(fromCurrency, toCurrency, formattedDate).then(rate => {
      if (rate !== null) {
        resolve(rate);
      }
    });

    // Se inscreve para receber atualizações futuras
    const unsubscribe = exchangeRateSubject.subscribe(cacheKey, (newRate) => {
      if (newRate !== null) {
        resolve(newRate);
      }
    });

    // Retorna uma função para cancelar a inscrição
    return unsubscribe;
  });
}

// Função para buscar taxa de câmbio da API
async function fetchExchangeRate(fromCurrency, toCurrency, date) {
  try {
    //

    // Mostra o loader
    loaderService.show('Buscando taxa de câmbio...', 'small');

    let rate = null;

    try {
      // Se ambas as moedas são criptomoedas
      if (isCryptoCurrency(fromCurrency) && isCryptoCurrency(toCurrency)) {
        rate = await fetchCryptoToCryptoRate(fromCurrency, toCurrency);
      }
      // Se a moeda de origem é cripto
      else if (isCryptoCurrency(fromCurrency)) {
        rate = await fetchCryptoToFiatRate(fromCurrency, toCurrency);
      }
      // Se a moeda de destino é cripto
      else if (isCryptoCurrency(toCurrency)) {
        rate = await fetchFiatToCryptoRate(fromCurrency, toCurrency);
      }
      // Se ambas são moedas tradicionais
      else {
        rate = await fetchFiatToFiatRate(fromCurrency, toCurrency);
      }
    } catch (error) {
      console.error('[Exchange Rate] Erro ao buscar taxa:', error);
      rate = null;
    }

    // Esconde o loader
    loaderService.hide();

    if (rate !== null) {
      // Armazena no cache
      const cacheKey = generateCacheKey(fromCurrency, toCurrency, date);
      exchangeRateCache.set(cacheKey, rate);

      // Notifica os observadores
      exchangeRateSubject.notify(cacheKey, rate);
    } else {
      console.warn('[Exchange Rate] Taxa não encontrada para', { fromCurrency, toCurrency });
    }

    return rate;
  } catch (error) {
    // Esconde o loader em caso de erro
    loaderService.hide();
    console.error('[Exchange Rate] Erro ao buscar taxa de câmbio:', error);
    return null;
  }
}

// Função para buscar taxa entre criptomoedas
async function fetchCryptoToCryptoRate(fromCrypto, toCrypto) {
  try {
    const fromId = getCoinGeckoId(fromCrypto);
    const toId = getCoinGeckoId(toCrypto);
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromId}&vs_currencies=${toId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[fromId]?.[toId] || null;
  } catch (error) {
    console.error('[Exchange Rate] Erro ao buscar taxa entre criptomoedas:', error);
    return null;
  }
}

// Função para buscar taxa de cripto para fiat
async function fetchCryptoToFiatRate(crypto, fiat) {
  try {
    const cryptoId = getCoinGeckoId(crypto);
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${fiat.toLowerCase()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[cryptoId]?.[fiat.toLowerCase()] || null;
  } catch (error) {
    console.error('[Exchange Rate] Erro ao buscar taxa de cripto para fiat:', error);
    return null;
  }
}

// Função para buscar taxa de fiat para cripto
async function fetchFiatToCryptoRate(fiat, crypto) {
  try {
    const cryptoId = getCoinGeckoId(crypto);
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${fiat.toLowerCase()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rate = data[cryptoId]?.[fiat.toLowerCase()];
    return rate ? 1 / rate : null;
  } catch (error) {
    console.error('[Exchange Rate] Erro ao buscar taxa de fiat para cripto:', error);
    return null;
  }
}

// Função para buscar taxa entre moedas tradicionais
async function fetchFiatToFiatRate(fromFiat, toFiat) {
  try {
    const url = `https://open.er-api.com/v6/latest/${fromFiat}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result === 'success' ? data.rates[toFiat] : null;
  } catch (error) {
    console.error('[Exchange Rate] Erro ao buscar taxa entre moedas tradicionais:', error);
    return null;
  }
}

// Função para converter valor de forma reativa
export function convertCurrencyReactive(value, fromCurrency, toCurrency) {
  return new Promise(async (resolve) => {
    if (fromCurrency === toCurrency) {
      resolve(value);
      return;
    }

    const rate = await getReactiveExchangeRate(fromCurrency, toCurrency);
    if (rate === null) {
      resolve(null);
      return;
    }

    // Garante que o valor e a taxa são números
    const numValue = Number(value);
    const numRate = Number(rate);

    // Calcula o valor convertido
    const convertedValue = numValue * numRate;

    //

    resolve(convertedValue);
  });
}

// Função para limpar o cache
export function clearCache() {
  exchangeRateCache.clear();
}

// Função para obter taxa de câmbio (mantida para compatibilidade)
export async function getExchangeRate(fromCurrency, toCurrency) {
  const today = new Date();
  const lastBusinessDay = getLastBusinessDay(today);
  const formattedDate = formatDate(lastBusinessDay);
  return fetchExchangeRate(fromCurrency, toCurrency, formattedDate);
}

// Função para converter valor (mantida para compatibilidade)
export async function convertCurrency(value, fromCurrency, toCurrency) {
  try {
    if (fromCurrency === toCurrency) {
      return value;
    }

    //
    const rate = await getExchangeRate(fromCurrency, toCurrency);

    if (rate === null) {
      console.warn('[Exchange Rate] Não foi possível converter o valor - taxa não encontrada');
      return null;
    }

    const convertedValue = value * rate;
    //

    return formatValue(convertedValue, toCurrency);
  } catch (error) {
    console.error('[Exchange Rate] Erro ao converter valor:', error);
    return null;
  }
}
