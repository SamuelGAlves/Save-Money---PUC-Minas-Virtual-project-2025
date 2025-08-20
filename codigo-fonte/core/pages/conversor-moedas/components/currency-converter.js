import { i18n } from '../../../i18n/i18n.js';
import { formatCurrencyCode, currencyOptions } from '../../../utils/currency.js';
import { convertCurrencyReactive } from '../../../services/exchangeRate.js';
import toast from '../../../services/toast.js';
import './conversion-history.js';

export class CurrencyConverter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.amount = '';
    this.fromCurrency = i18n.getTranslation('common.currency');
    this.toCurrency = localStorage.getItem('converter_toCurrency') || 'BTC';
    this.result = null;
    this.loading = false;
    this.error = null;
    this.currencyOptions = currencyOptions;
    this.userChangedCurrency = false;
    this.userSelectedToCurrency = localStorage.getItem('converter_userSelectedToCurrency') === 'true';
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.setupI18nObserver();
  }

  disconnectedCallback() {
    // Remove o observador quando o componente é removido
    i18n.removeObserver(this.handleLanguageChange);
  }

  setupI18nObserver() {
    // Adiciona o observador para mudanças no idioma
    i18n.addObserver(this.handleLanguageChange.bind(this));
  }

  handleLanguageChange() {
    // Atualiza o currency-type do input com base no i18n
    const amountInput = this.shadowRoot.getElementById('amount');

    if (amountInput) {
      // Se o usuário não alterou o select, atualiza para a moeda do i18n
      if (!this.userChangedCurrency) {
        this.fromCurrency = i18n.getTranslation('common.currency');
        amountInput.setAttribute('currency-type', this.fromCurrency);

        // Atualiza o valor do input para refletir a nova moeda
        const input = amountInput.shadowRoot.querySelector('input');
        if (input) {
          input.value = this.amount;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  }

  setError(input, message) {

    if (input) {
      if (typeof input.setError === 'function') {
        input.setError(message);
      } else {
        console.error('[CurrencyConverter] Input não tem método setError:', input);
      }
    } else {
      console.error('[CurrencyConverter] Input não encontrado');
    }
  }

  clearErrors() {
    const amountInput = this.shadowRoot.getElementById('amount');
    const toCurrencySelect = this.shadowRoot.getElementById('toCurrency');

    if (amountInput?.clearError) {
      amountInput.clearError();
    }
    if (toCurrencySelect?.clearError) {
      toCurrencySelect.clearError();
    }
  }

  validateAmount(amount) {

    if (!amount || amount.trim() === '') {
      return i18n.getTranslation('converter.error.empty');
    }

    // Lista de criptomoedas
    const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'DOGE', 'AVAX', 'MATIC'];
    const isCrypto = CRYPTO_CURRENCIES.includes(this.fromCurrency);

    // Limpa o valor formatado como moeda
    let cleanAmount;
    if (isCrypto) {
      // Para criptomoedas, mantém o ponto como separador decimal
      cleanAmount = amount.replace(/[^\d.]/g, '');
    } else {
      // Para moedas tradicionais, converte vírgula para ponto
      cleanAmount = amount.replace(/[^\d,]/g, '').replace(',', '.');
    }

    const numAmount = parseFloat(cleanAmount);



    if (isNaN(numAmount)) {
      return i18n.getTranslation('converter.error.invalid');
    }

    if (numAmount <= 0) {
      return i18n.getTranslation('converter.error.zero');
    }

    return null;
  }

  validateCurrencies(fromCurrency, toCurrency) {

    if (!fromCurrency || !toCurrency) {
      return i18n.getTranslation('converter.error.generic');
    }
    if (fromCurrency === toCurrency) {
      return i18n.getTranslation('converter.error.same');
    }
    return null;
  }

  async handleSubmit(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.error = null;
    this.result = null;
    this.clearErrors();

    const amountInput = this.shadowRoot.getElementById('amount');
    const toCurrencySelect = this.shadowRoot.getElementById('toCurrency');

    if (!amountInput || !toCurrencySelect) {
      console.error('[CurrencyConverter] Elementos não encontrados');
      return;
    }

    const amount = amountInput.shadowRoot.querySelector('input')?.value;
    const toCurrency = toCurrencySelect.value;
    const fromCurrency = amountInput.getAttribute('currency-type');

    // Atualiza o estado com os valores atuais
    this.amount = amount;
    this.toCurrency = toCurrency;
    this.fromCurrency = fromCurrency;

    // Validar todos os campos e coletar erros
    const amountError = this.validateAmount(amount);
    const currencyError = this.validateCurrencies(fromCurrency, toCurrency);

    if (amountError || currencyError) {
      this.error = [amountError, currencyError].filter(Boolean).join('\n');

      // Adiciona os erros nos campos
      if (amountError) {
        this.setError(amountInput, amountError);
      }
      if (currencyError) {
        this.setError(toCurrencySelect, currencyError);
      }

      // Mostra o toast com o erro
      toast.error(this.error);
      return;
    }

    try {
      this.loading = true;
      this.render();

      // Lista de criptomoedas
      const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'DOGE', 'AVAX', 'MATIC'];
      const isCrypto = CRYPTO_CURRENCIES.includes(fromCurrency);

      // Limpa o valor formatado como moeda
      let cleanAmount;
      if (isCrypto) {
        // Para criptomoedas, mantém o ponto como separador decimal
        cleanAmount = amount.replace(/[^\d.]/g, '');
      } else {
        // Para moedas tradicionais, converte vírgula para ponto
        cleanAmount = amount.replace(/[^\d,]/g, '').replace(',', '.');
      }
      const numAmount = parseFloat(cleanAmount);

      // Primeiro, converte 1 unidade para obter a taxa
      const rateResult = await new Promise((resolve) => {
        convertCurrencyReactive(
          1,
          fromCurrency,
          toCurrency
        ).then(value => {
          resolve(value);
        });
      });

      if (rateResult === null) {
        throw new Error(i18n.getTranslation('converter.error.rate'));
      }

      // Depois converte o valor real
      const result = await new Promise((resolve) => {
        convertCurrencyReactive(
          numAmount,
          fromCurrency,
          toCurrency
        ).then(value => {
          resolve(value);
        });
      });

      if (result === null) {
        throw new Error(i18n.getTranslation('converter.error.rate'));
      }

      // Formata o resultado usando formatCurrencyCode
      this.result = formatCurrencyCode(result, toCurrency);
      this.exchangeRate = rateResult;

      // Adiciona ao histórico
      const historyComponent = this.shadowRoot.querySelector('conversion-history');
      if (historyComponent) {
        await historyComponent.addToHistory({
          fromAmount: numAmount,
          toAmount: result,
          fromCurrency,
          toCurrency,
          rate: rateResult
        });
      }

    } catch (error) {
      console.error('[CurrencyConverter] Erro na conversão:', error);
      this.error = i18n.getTranslation('converter.error.generic');
      toast.error(this.error);
    } finally {
      this.loading = false;
      this.render();
      this.setupEventListeners();
    }
  }

  async swapCurrencies() {


    // Salva o valor atual
    const currentAmount = this.amount;
    const currentFromCurrency = this.fromCurrency;
    const currentToCurrency = this.toCurrency;

    // Inverte as moedas
    this.fromCurrency = currentToCurrency;
    this.toCurrency = currentFromCurrency;

    // Atualiza o localStorage
    localStorage.setItem('converter_toCurrency', this.toCurrency);

    // Atualiza os elementos
    const amountInput = this.shadowRoot.getElementById('amount');
    const toCurrencySelect = this.shadowRoot.getElementById('toCurrency');

    if (amountInput) {
      amountInput.setAttribute('currency-type', this.fromCurrency);
      const input = amountInput.shadowRoot.querySelector('input');
      if (input) {
        // Mantém o valor atual
        this.amount = currentAmount;
        input.value = currentAmount;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    if (toCurrencySelect) {
      toCurrencySelect.value = this.toCurrency;
    }

    // Limpa o resultado anterior
    this.result = null;
    this.exchangeRate = null;

    // Re-renderiza o componente
    this.render();
    this.setupEventListeners();

    // Se houver um valor, faz a conversão automaticamente
    if (this.amount && this.amount.trim() !== '') {

      await this.handleSubmit();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .converter-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .converter-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .currency-swap-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          width: 100%;
          app-input {
            flex: 1;
            width: 100%;
          }
        }

        .currency-swap-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: var(--primary-color);
          transition: transform 0.2s ease;
        }

        .currency-swap-button:hover {
          transform: scale(1.1);
        }

        .currency-swap-button app-icon {
          font-size: 1.5rem;
        }

        .button-section {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .result-container {
          margin-top: 2rem;
          padding: 2rem;
          background-color: var(--background-card-color);
          border-radius: 1rem;
          border: 1px solid var(--border-color);
          text-align: center;
        }

        .result-value {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin: 1rem 0;
          font-weight: bold;
        }

        .result-rate {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-top: 0.5rem;
        }

        .error-message {
          color: var(--error-color);
          margin-top: 0.5rem;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          padding: 1rem;
        }

        .result-section {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background-color: var(--background-card-color);
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid var(--border-color);
        }

        .result-section h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          color: var(--text-color);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .result-value {
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--primary-color);
          margin: 1rem 0;
          padding: 1rem;
          background-color: var(--background-color);
          border-radius: 8px;
          border: 2px solid var(--primary-color);
        }

        .result-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
          font-size: 0.9rem;
          color: var(--text-color-secondary);
        }

        .result-detail {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .result-detail app-icon {
          color: var(--primary-color);
        }

        .error-section {
          color: var(--error-color);
          padding: 1rem;
          background-color: var(--error-background);
          border-radius: 8px;
          margin-top: 1rem;
          text-align: center;
        }

        .loading-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          color: var(--text-secondary);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--primary-color);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (min-width: 768px) {
          .currency-swap-container {
            flex-direction: row;
            max-width: 800px;
            margin: 0 auto;
          }

          .currency-swap-button {
            margin: 0 1rem;
          }

          .input-group app-input {
            flex: 1;
            max-width: 300px;
          }

          .input-group app-select {
            width: 200px;
          }

          .button-section {
            justify-content: center;
          }

          .button-section app-button {
            width: auto;
            min-width: 200px;
            max-width: 300px;
          }
        }

        @media (max-width: 768px) {
          .currency-swap-container {
            flex-direction: column;
          }

          .currency-swap-button {
            margin: 0.5rem 0;
            transform: rotate(90deg);
          }

          .currency-swap-button:hover {
            transform: rotate(90deg) scale(1.1);
          }

          .converter-grid {
            gap: 1rem;
          }

          .button-section {
            justify-content: center;
          }

          app-button {
            width: 100%;
          }

          .result-container {
            padding: 1.5rem;
          }

          .result-value {
            font-size: 2rem;
          }

          .result-section {
            padding: 1rem;
          }

          .result-value {
            font-size: 1.75rem;
            padding: 0.75rem;
          }

          .result-details {
            font-size: 0.85rem;
          }
        }
      </style>

      <div class="converter-container">
        <div class="converter-grid">
          <div class="input-group">
            <div class="currency-swap-container">
              <app-input
                id="amount"
                type="currency"
                currency-type="${this.fromCurrency}"
                label="${i18n.getTranslation('converter.amount.label')}"
                placeholder="${i18n.getTranslation('converter.amount.placeholder')}"
                required
                min="0.01"
                step="0.01"
                aria-label="${i18n.getTranslation('converter.amount.label')}"
                aria-required="true"
                value="${this.amount}"
              ></app-input>

              <button class="currency-swap-button" id="swapButton" aria-label="${i18n.getTranslation('converter.swap')}">
                <app-icon>swap_horiz</app-icon>
              </button>

              <app-select
                id="toCurrency"
                label="${i18n.getTranslation('converter.to')}"
                value="${this.toCurrency}"
                options='${JSON.stringify(this.currencyOptions)}'
                aria-label="${i18n.getTranslation('converter.to')}"
              ></app-select>
            </div>
          </div>

          <div class="button-section">
            <app-button class="convert-button" id="convertButton" fullwidth="true">
              <app-icon>sync_alt</app-icon>
              ${i18n.getTranslation('converter.convert')}
            </app-button>
          </div>

          ${this.loading ? `
            <div class="loading-section">
              <div class="loading-spinner"></div>
              <p>${i18n.getTranslation('converter.loading')}</p>
            </div>
          ` : ''}

          ${this.error ? `
            <div class="error-section">
              <p>${this.error}</p>
            </div>
          ` : ''}

          ${this.result ? `
            <div class="result-section">
              <div class="result-header">
                <app-icon>sync_alt</app-icon>
                <h3>${i18n.getTranslation('converter.result')}</h3>
              </div>
              <div class="result-value">${this.result}</div>
              <div class="result-details">
                <div class="result-detail">
                  <app-icon>swap_horiz</app-icon>
                  <span>${i18n.getTranslation('converter.rate')}: 1 ${this.fromCurrency} = ${formatCurrencyCode(this.exchangeRate, this.toCurrency)}</span>
                </div>
                <div class="result-detail">
                  <app-icon>schedule</app-icon>
                  <span>${i18n.getTranslation('converter.lastUpdate')}: ${new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ` : ''}

          <conversion-history></conversion-history>
        </div>
      </div>
    `;

    this.updateInput();
  }

  updateInput() {
    const amountInput = this.shadowRoot.getElementById('amount');
    if (amountInput) {
      // Força a atualização do currency-type
      amountInput.setAttribute('currency-type', this.fromCurrency);

      // Força a atualização do valor
      const input = amountInput.shadowRoot.querySelector('input');
      if (input) {
        input.value = this.amount;
        // Dispara o evento input para atualizar a formatação
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    // Mantém o valor do select de moeda de destino se o usuário já escolheu
    const toCurrencySelect = this.shadowRoot.getElementById('toCurrency');
    if (toCurrencySelect && this.userSelectedToCurrency) {
      toCurrencySelect.value = this.toCurrency;
    }
  }

  setupEventListeners() {

    const button = this.shadowRoot.getElementById('convertButton');
    const swapButton = this.shadowRoot.getElementById('swapButton');


    if (button) {
      button.addEventListener('click', (e) => {

        e.preventDefault();
        e.stopPropagation();
        this.handleSubmit();
      });
    }

    if (swapButton) {
      swapButton.addEventListener('click', (e) => {

        e.preventDefault();
        e.stopPropagation();
        this.swapCurrencies();
      });
    }

    // Adiciona listener para mudanças no select de moeda
    const toCurrencySelect = this.shadowRoot.getElementById('toCurrency');
    if (toCurrencySelect) {
      toCurrencySelect.addEventListener('change', () => {
        this.userChangedCurrency = true;
        this.userSelectedToCurrency = true;
        this.toCurrency = toCurrencySelect.value;

        // Persiste os valores no localStorage
        localStorage.setItem('converter_toCurrency', this.toCurrency);
        localStorage.setItem('converter_userSelectedToCurrency', 'true');
      });
    }

    // Atualiza o input após configurar os event listeners
    this.updateInput();
  }
}

customElements.define('currency-converter', CurrencyConverter);
