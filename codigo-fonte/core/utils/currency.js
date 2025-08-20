import { i18n } from '../i18n/i18n.js';

export function sumValues(items, key = 'value') {
  return items.reduce((sum, item) => sum + parseFloat(item[key] || 0), 0);
}

export function formatCurrencyBRL(value) {
  return i18n.formatCurrency(isNaN(value) ? 0 : value);
}

export function formatCurrencyCode(value, currency) {
  // Se o valor for nulo ou não for um número, retorna vazio
  if (value === null || isNaN(value)) return '';

  // Se a moeda for nula ou indefinida, usa o padrão do i18n
  if (!currency) {
    currency = i18n.getTranslation('common.currency') || 'BRL';
  }

  // Garante que o valor é um número
  const numValue = Number(value);

  //

  // Lista de criptomoedas
  const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'DOGE', 'AVAX', 'MATIC'];

  // Se for uma criptomoeda
  if (CRYPTO_CURRENCIES.includes(currency)) {
    // Para valores muito pequenos (menores que 0.0001), mostra mais casas decimais
    if (numValue < 0.0001) {
      return `${currency} ${numValue.toFixed(8)}`;
    }
    // Para valores pequenos (menores que 1), mostra 6 casas decimais
    else if (numValue < 1) {
      return `${currency} ${numValue.toFixed(6)}`;
    }
    // Para valores maiores, mostra 4 casas decimais
    else {
      return `${currency} ${numValue.toFixed(4)}`;
    }
  }

  try {
    // Para moedas tradicionais, usa o Intl.NumberFormat com o locale do i18n
    const formattedValue = new Intl.NumberFormat(i18n.currentLanguage, {
      style: 'currency',
      currency: currency
    }).format(numValue);

    //

    return formattedValue;
  } catch (error) {
    console.error('[Currency Format] Erro ao formatar valor:', error);
    // Em caso de erro, retorna um formato básico
    return `${currency} ${numValue.toFixed(2)}`;
  }
}

export function getTotalValueBRL(items, key = 'value') {
  const total = sumValues(items, key);
  return formatCurrencyBRL(total);
}

export function parseCurrencyBRL(formattedValue) {
  const currency = i18n.getTranslation('common.currency');
  const separator = currency === 'BRL' ? ',' : '.';
  const groupSeparator = currency === 'BRL' ? '.' : ',';

  return (
    parseFloat(
      formattedValue
        .replace(/[^\d.,]/g, '') // Remove símbolos de moeda e espaços
        .replace(new RegExp(`\\${groupSeparator}`, 'g'), '') // Remove separadores de grupo
        .replace(separator, '.') // Troca separador decimal por ponto
    ) || 0
  );
}

// Função para atualizar todos os inputs de moeda na página
export function updateAllCurrencyInputs() {
  const inputs = document.querySelectorAll('app-input[type="currency"]');
  inputs.forEach((input) => {
    const rawValue = input.dataset.rawValue;
    if (rawValue) {
      const formatted = formatCurrencyBRL(parseFloat(rawValue));
      input.value = formatted;
      input.setAttribute('value', formatted);
    }
  });
}

// Função para obter as opções de moeda
export async function getCurrencyOptions() {
  // Aguardar o i18n inicializar
  await i18n.init();

  return [
    // Moedas Fiat
    { value: 'BRL', label: i18n.getTranslation('currencies.BRL') },
    { value: 'CHF', label: i18n.getTranslation('currencies.CHF') },
    { value: 'RUB', label: i18n.getTranslation('currencies.RUB') },
    { value: 'CNY', label: i18n.getTranslation('currencies.CNY') },
    { value: 'GBP', label: i18n.getTranslation('currencies.GBP') },
    { value: 'USD', label: i18n.getTranslation('currencies.USD') },
    { value: 'CAD', label: i18n.getTranslation('currencies.CAD') },
    { value: 'AUD', label: i18n.getTranslation('currencies.AUD') },
    { value: 'SGD', label: i18n.getTranslation('currencies.SGD') },
    { value: 'NZD', label: i18n.getTranslation('currencies.NZD') },
    { value: 'HKD', label: i18n.getTranslation('currencies.HKD') },
    { value: 'ARS', label: i18n.getTranslation('currencies.ARS') },
    { value: 'MXN', label: i18n.getTranslation('currencies.MXN') },
    { value: 'COP', label: i18n.getTranslation('currencies.COP') },
    { value: 'SEK', label: i18n.getTranslation('currencies.SEK') },
    { value: 'NOK', label: i18n.getTranslation('currencies.NOK') },
    { value: 'DKK', label: i18n.getTranslation('currencies.DKK') },
    { value: 'INR', label: i18n.getTranslation('currencies.INR') },
    { value: 'ZAR', label: i18n.getTranslation('currencies.ZAR') },
    { value: 'TRY', label: i18n.getTranslation('currencies.TRY') },
    { value: 'SAR', label: i18n.getTranslation('currencies.SAR') },
    { value: 'AED', label: i18n.getTranslation('currencies.AED') },
    { value: 'PLN', label: i18n.getTranslation('currencies.PLN') },
    { value: 'ILS', label: i18n.getTranslation('currencies.ILS') },
    { value: 'THB', label: i18n.getTranslation('currencies.THB') },
    { value: 'EUR', label: i18n.getTranslation('currencies.EUR') },

    // Criptomoedas
    { value: 'BTC', label: i18n.getTranslation('currencies.BTC') },
    { value: 'ETH', label: i18n.getTranslation('currencies.ETH') },
    { value: 'BNB', label: i18n.getTranslation('currencies.BNB') },
    { value: 'XRP', label: i18n.getTranslation('currencies.XRP') },
    { value: 'ADA', label: i18n.getTranslation('currencies.ADA') },
    { value: 'SOL', label: i18n.getTranslation('currencies.SOL') },
    { value: 'DOT', label: i18n.getTranslation('currencies.DOT') },
    { value: 'DOGE', label: i18n.getTranslation('currencies.DOGE') },
    { value: 'AVAX', label: i18n.getTranslation('currencies.AVAX') },
    { value: 'MATIC', label: i18n.getTranslation('currencies.MATIC') }
  ];
}

// Exportar currencyOptions como uma constante com as opções básicas
export const currencyOptions = [
  // Moedas Fiat
  { value: 'BRL', label: 'Real Brasileiro' },
  { value: 'CHF', label: 'Franco Suíço' },
  { value: 'RUB', label: 'Rublo Russo' },
  { value: 'CNY', label: 'Yuan Chinês' },
  { value: 'GBP', label: 'Libra Esterlina' },
  { value: 'USD', label: 'Dólar Americano' },
  { value: 'CAD', label: 'Dólar Canadense' },
  { value: 'AUD', label: 'Dólar Australiano' },
  { value: 'SGD', label: 'Dólar de Cingapura' },
  { value: 'NZD', label: 'Dólar Neozelandês' },
  { value: 'HKD', label: 'Dólar de Hong Kong' },
  { value: 'ARS', label: 'Peso Argentino' },
  { value: 'MXN', label: 'Peso Mexicano' },
  { value: 'COP', label: 'Peso Colombiano' },
  { value: 'SEK', label: 'Coroa Sueca' },
  { value: 'NOK', label: 'Coroa Norueguesa' },
  { value: 'DKK', label: 'Coroa Dinamarquesa' },
  { value: 'INR', label: 'Rupia Indiana' },
  { value: 'ZAR', label: 'Rand Sul-Africano' },
  { value: 'TRY', label: 'Lira Turca' },
  { value: 'SAR', label: 'Riyal Saudita' },
  { value: 'AED', label: 'Dirham dos Emirados' },
  { value: 'PLN', label: 'Zloty Polonês' },
  { value: 'ILS', label: 'Shekel Israelense' },
  { value: 'THB', label: 'Baht Tailandês' },
  { value: 'EUR', label: 'Euro' },

  // Criptomoedas
  { value: 'BTC', label: 'Bitcoin' },
  { value: 'ETH', label: 'Ethereum' },
  { value: 'BNB', label: 'Binance Coin' },
  { value: 'XRP', label: 'Ripple' },
  { value: 'ADA', label: 'Cardano' },
  { value: 'SOL', label: 'Solana' },
  { value: 'DOT', label: 'Polkadot' },
  { value: 'DOGE', label: 'Dogecoin' },
  { value: 'AVAX', label: 'Avalanche' },
  { value: 'MATIC', label: 'Polygon' }
];

// Registrar o observador para atualizar inputs quando o idioma mudar
i18n.addObserver(updateAllCurrencyInputs);
