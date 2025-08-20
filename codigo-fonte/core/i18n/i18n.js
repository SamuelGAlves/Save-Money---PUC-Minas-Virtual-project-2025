import { loaderService } from '../services/loader.js';

class I18n {
  constructor() {
    this.currentLanguage = localStorage.getItem('preferredLanguage') || 'pt-BR';
    this.translations = {};
    this.observers = new Set();
    this.availableLanguages = {
      'pt-BR': 'Português (Brasil)',
      'en-US': 'English (US)',
      'es-ES': 'Español',
      'fr-FR': 'Français',
      'ar-SA': 'العربية',
      'zh-CN': '中文',
      'ru-RU': 'Русский',
      'hi-IN': 'हिन्दी',
      'zu-ZA': 'isiZulu'
    };

    // Mensagens padrão de loading para cada idioma
    this.defaultLoadingMessages = {
      'pt-BR': 'Carregando traduções...',
      'en-US': 'Loading translations...',
      'es-ES': 'Cargando traducciones...',
      'fr-FR': 'Chargement des traductions...',
      'ar-SA': 'جاري تحميل الترجمات...',
      'zh-CN': '正在加载翻译...',
      'ru-RU': 'Загрузка переводов...',
      'hi-IN': 'अनुवाद लोड हो रहे हैं...',
      'zu-ZA': 'Iyalungiswa liyalayishwa...'
    };
  }

  async init() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'pt-BR';
    this.currentLanguage = savedLanguage;
    await this.loadTranslations(this.currentLanguage);
    this.updateDocumentLanguage();
  }

  async loadTranslations(language) {
    try {
      // Usa a mensagem padrão do idioma atual
      const loadingMessage = this.defaultLoadingMessages[language] || 'Loading translations...';
      loaderService.show(loadingMessage);

      const url = `/codigo-fonte/core/i18n/translations/${language.toLowerCase()}/translate.json`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`[I18n] Erro ao carregar traduções: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || typeof data !== 'object') {
        throw new Error('Formato de tradução inválido');
      }

      this.translations = data;
      this.notifyObservers();
    } catch (error) {
      console.error('[I18n] Erro ao carregar traduções:', error);
      // Fallback para traduções padrão
      this.translations = {
        pages: {
          home: "Início - Save Money",
          expenses: "Despesas - Save Money",
          income: "Receitas - Save Money",
          categories: "Categorias - Save Money",
          reminders: "A Vencer - Save Money",
          goals: "Metas - Save Money",
          reports: "Relatórios - Save Money",
          investments: "Investimentos - Save Money",
          profile: "Perfil - Save Money",
          register: "Registrar - Save Money",
          about: "Sobre - Save Money",
          contact: "Contato - Save Money",
          tests: "Relatório de Testes - Save Money",
          login: "Entrar - Save Money",
          resetPassword: "Recuperar Senha - Save Money",
          currencyConverter: "Conversor de Moedas - Save Money",
          notFound: "Página não encontrada - Save Money"
        },
        common: {
          currency: 'BRL',
          language: 'pt-BR'
        },
        navigation: {
          home: 'Início',
          expenses: 'Despesas',
          income: 'Receitas',
          reports: 'Relatórios',
          reminders: 'Lembretes',
          goals: 'Metas'
        },
        currency: {
          format: {
            style: 'currency',
            currency: 'BRL'
          }
        }
      };
    } finally {
      loaderService.hide();
    }
  }

  updateDocumentLanguage() {
    document.documentElement.lang = this.currentLanguage;
  }

  async setLanguage(language) {

    this.currentLanguage = language;
    await this.loadTranslations(language);
    this.updateDocumentLanguage();
  }

  getTranslation(key, params = {}) {
    if (!key) {
      console.warn('[I18n] Chave de tradução vazia');
      return '';
    }

    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (!value || typeof value !== 'object') {
        console.warn(`[I18n] Tradução não encontrada para a chave: ${key} (valor inválido em ${k})`);
        return key;
      }

      // Tenta encontrar a chave exata
      if (value[k] !== undefined) {
        value = value[k];
        continue;
      }

      // Se não encontrar, tenta converter de snake_case para camelCase
      const camelKey = k.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      if (value[camelKey] !== undefined) {
        value = value[camelKey];
        continue;
      }

      // Se não encontrar, tenta converter de camelCase para snake_case
      const snakeKey = k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (value[snakeKey] !== undefined) {
        value = value[snakeKey];
        continue;
      }

      // Se não encontrar em nenhum formato, retorna a chave original
      console.warn(`[I18n] Tradução não encontrada para a chave: ${key} (não encontrado em ${k})`);
      return key;
    }

    if (typeof value === 'string') {
      const result = value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });

      return result;
    }

    if (value === undefined || value === null) {
      console.warn(`[I18n] Valor indefinido para a chave: ${key}`);
      return key;
    }

    return value;
  }

  formatCurrency(value) {
    const currency = this.getTranslation('common.currency');
    const format = {
      style: 'currency',
      currency: currency
    };
    return new Intl.NumberFormat(this.currentLanguage, format).format(value);
  }

  addObserver(observer) {
    this.observers.add(observer);
  }

  removeObserver(observer) {
    this.observers.delete(observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer());
  }

  getAvailableLanguages() {
    return this.availableLanguages;
  }
}

export const i18n = new I18n();
