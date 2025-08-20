import { i18n } from '../../../i18n/i18n.js';
import { getShowValues } from '../../../store/visibilityStore.js';
import { formatCurrencyCode, currencyOptions } from '../../../utils/currency.js';
import { convertCurrencyReactive } from '../../../services/exchangeRate.js';

class TotalCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.convertedValues = new Map();
    this.isUpdating = false;
    this.unsubscribeCallbacks = new Map();
  }

  static get observedAttributes() {
    return ['title', 'type', 'totals', 'estimated-totals', 'items-count', 'recurrences-count'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      //
      this.render();
    }
  }

  async updateConvertedValues(totals, estimatedTotals) {
    if (this.isUpdating) return;

    try {
      this.isUpdating = true;
      const baseCurrency = i18n.getTranslation('common.currency') || 'BRL';
      //
      const newConvertedValues = new Map();

      // Limpa as inscrições anteriores
      this.unsubscribeCallbacks.forEach(callback => callback());
      this.unsubscribeCallbacks.clear();

      for (const [currency, value] of Object.entries(totals)) {
        if (Number(value) === 0 || currency === baseCurrency) {
          //
          continue;
        }

        try {
          // Converte o valor principal
          const convertedValue = await convertCurrencyReactive(value, currency, baseCurrency);
          if (convertedValue !== null) {
            //

            // Converte o valor estimado se existir
            let convertedEstimated = null;
            const estimatedValue = estimatedTotals[currency];
            //

            if (estimatedValue) {
              convertedEstimated = await convertCurrencyReactive(estimatedValue, currency, baseCurrency);
              //
            }

            newConvertedValues.set(currency, {
              value: convertedValue,
              estimated: convertedEstimated,
              recurring: value.recurring
            });
          }
        } catch (error) {
          console.error('[TotalCard] Erro na conversão:', {
            fromCurrency: currency,
            toCurrency: baseCurrency,
            value,
            error
          });
        }
      }

      //
      this.convertedValues = newConvertedValues;
      this.render();
    } finally {
      this.isUpdating = false;
    }
  }

  formatValue(value, currency) {
    const showValues = getShowValues();
    if (!showValues) return '••••••••';

    const numValue = Number(value);
    if (isNaN(numValue)) {
      console.warn('[TotalCard] Valor inválido para formatação:', value);
      return formatCurrencyCode(0, currency);
    }

    return formatCurrencyCode(Math.abs(numValue), currency);
  }

  getPageType() {
    const type = this.getAttribute('type') || '';
    switch (type) {
      case 'investments':
        return 'investimentos';
      case 'income':
        return 'receitas';
      case 'expenses':
        return 'despesas';
      default:
        return '';
    }
  }

  getSortedCurrencies(totals) {
    const currentCurrency = i18n.getTranslation('common.currency') || 'BRL';
    const currencies = Object.keys(totals).filter(currency => Number(totals[currency]) !== 0);

    // Separa a moeda atual das demais
    const otherCurrencies = currencies.filter(currency => currency !== currentCurrency);

    // Ordena as outras moedas pelo valor absoluto
    const sortedOtherCurrencies = otherCurrencies.sort((a, b) => {
      const valueA = Math.abs(Number(totals[a]) || 0);
      const valueB = Math.abs(Number(totals[b]) || 0);
      return valueB - valueA;
    });

    // Retorna array com a moeda atual primeiro, seguida das outras ordenadas
    return currentCurrency && currencies.includes(currentCurrency)
      ? [currentCurrency, ...sortedOtherCurrencies]
      : sortedOtherCurrencies;
  }

  async render() {
    const title = this.getAttribute('title') || '';
    const type = this.getAttribute('type') || '';
    const totalsStr = this.getAttribute('totals');
    const estimatedTotalsStr = this.getAttribute('estimated-totals');
    const itemsCountStr = this.getAttribute('items-count');
    const recurrencesCountStr = this.getAttribute('recurrences-count');
    const baseCurrency = i18n.getTranslation('common.currency') || 'BRL';
    const showValues = getShowValues();

    //

    let totals = {};
    let estimatedTotals = {};
    let itemsCount = {};
    let recurrencesCount = {};

    try {
      totals = totalsStr ? JSON.parse(totalsStr) : {};
      estimatedTotals = estimatedTotalsStr ? JSON.parse(estimatedTotalsStr) : {};
      itemsCount = itemsCountStr ? JSON.parse(itemsCountStr) : {};
      recurrencesCount = recurrencesCountStr ? JSON.parse(recurrencesCountStr) : {};
      //
    } catch (error) {
      console.error('[TotalCard] Erro ao fazer parse dos valores:', error);
      totals = {};
      estimatedTotals = {};
      itemsCount = {};
      recurrencesCount = {};
    }

    if (!this.isUpdating && showValues) {
      await this.updateConvertedValues(totals, estimatedTotals);
    } else if (!showValues) {
      this.convertedValues.clear();
    }

    const currencies = this.getSortedCurrencies(totals);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          box-sizing: border-box;
        }

        .summary-card {
          background: var(--background-card-color);
          padding: 1.25rem;
          border-radius: 0.75rem;
          box-shadow: var(--header-box-shadow);
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease;
          box-sizing: border-box;
        }

        .summary-card:hover {
          transform: translateY(-2px);
        }

        .summary-card h3 {
          margin: 0 0 1.25rem 0;
          font-size: 1.1rem;
          color: var(--text-color);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .summary-card h3 app-icon {
          font-size: 1.2rem;
          color: var(--text-muted-color);
        }

        .summary-card .value {
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--color-primary);
          margin: 0.25rem 0;
        }

        .summary-card .currency-section {
          margin-bottom: 1.25rem;
          padding: 0.75rem;
          background: var(--background-color);
          border-radius: 0.5rem;
          box-sizing: border-box;
        }

        .summary-card .currency-section:hover {
          background: var(--color-gray-light);
        }

        .summary-card .currency-section:last-child {
          margin-bottom: 0;
        }

        .summary-card .currency-label {
          font-size: 0.9rem;
          color: var(--text-muted-color);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .summary-card .currency-label app-icon {
          font-size: 1rem;
          color: var(--text-muted-color);
        }

        .summary-card .estimated-value {
          font-size: 0.9rem;
          color: var(--text-muted-color);
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-color);
        }

        .summary-card .estimated-value app-icon {
          font-size: 1rem;
          color: var(--text-muted-color);
        }

        .summary-card.investments .value {
          color: var(--color-success);
        }

        .summary-card.income .value {
          color: var(--color-info);
        }

        .summary-card.expenses .value {
          color: var(--color-danger);
        }

        .view-details-btn {
          background: none;
          border: none;
          color: var(--color-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s;
          font-size: 0.9rem;
          margin-top: auto;
          align-self: flex-end;
        }

        .view-details-btn:hover {
          background-color: var(--color-gray-light);
        }

        @media (max-width: 480px) {
          .summary-card {
            padding: 1rem;
            box-shadow: var(--header-box-shadow);
          }

          .summary-card:hover {
            transform: none;
            box-shadow: var(--header-box-shadow);
          }

          .summary-card h3 {
            font-size: 0.95rem;
            margin-bottom: 1rem;
          }

          .summary-card .value {
            font-size: 1.2rem;
          }

          .summary-card .currency-section {
            padding: 0.6rem;
            margin-bottom: 1rem;
          }

          .summary-card .currency-label {
            font-size: 0.85rem;
          }

          .summary-card .estimated-value {
            font-size: 0.85rem;
            margin-top: 0.6rem;
            padding-top: 0.6rem;
          }

          .view-details-btn {
            font-size: 0.85rem;
            padding: 0.35rem;
          }
        }

        .currency-details {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted-color);
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-color);
        }

        .currency-detail {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .currency-detail app-icon {
          font-size: 1rem;
          color: var(--text-muted-color);
        }
      </style>

      <div class="summary-card ${type}">
        <h3>
          <app-icon>${type === 'investments' ? 'trending_up' : type === 'income' ? 'attach_money' : 'trending_down'}</app-icon>
          ${title}
        </h3>
        ${currencies.map(currency => {
          const currencyInfo = currencyOptions.find(opt => opt.value === currency) || { label: currency };
          const value = Number(totals[currency]) || 0;
          const estimatedValue = Number(estimatedTotals[currency]) || 0;
          const convertedData = this.convertedValues.get(currency);

          //

          if (value === 0) return '';

          return `
            <div class="currency-section">
              <div class="currency-label">
                <app-icon>currency_exchange</app-icon>
                ${currencyInfo.label}
              </div>
              <div class="value">${this.formatValue(value, currency)}</div>
              ${convertedData?.value ? `
                <div class="estimated-value">
                  <app-icon>sync_alt</app-icon>
                  ${i18n.getTranslation('home.converted')}: ${this.formatValue(convertedData.value, baseCurrency)}
                </div>
              ` : ''}
              ${convertedData?.estimated ? `
                <div class="estimated-value">
                  <app-icon>sync_alt</app-icon>
                  ${i18n.getTranslation('home.converted')} (${i18n.getTranslation('home.estimated')}): ${this.formatValue(convertedData.estimated, baseCurrency)}
                </div>
              ` : ''}
              ${convertedData?.recurring ? `
                <div class="estimated-value">
                  <app-icon>repeat</app-icon>
                  ${i18n.getTranslation('common.card.recurrence.badge')}
                </div>
              ` : ''}
              ${estimatedValue !== 0 ? `
                <div class="estimated-value">
                  <app-icon>${type === 'expenses' ? 'calendar_month' : 'trending_up'}</app-icon>
                  ${i18n.getTranslation('home.estimated')}: ${this.formatValue(estimatedValue, currency)}
                </div>
              ` : ''}
              ${((itemsCount[currency] || 0) > 1 || (recurrencesCount[currency] || 0) > 0) ? `
                <div class="currency-details">
                  ${(itemsCount[currency] || 0) > 1 ? `
                    <div class="currency-detail">
                      <app-icon>list</app-icon>
                      ${itemsCount[currency]} itens
                    </div>
                  ` : '<div class="currency-detail"></div>'}
                  ${(recurrencesCount[currency] || 0) > 0 ? `
                    <div class="currency-detail">
                      <app-icon>repeat</app-icon>
                      ${recurrencesCount[currency]} recorrências
                    </div>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
        <button class="view-details-btn">
          <app-icon>arrow_forward</app-icon>
          ${i18n.getTranslation('home.viewDetails')}
        </button>
      </div>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {
    const button = this.shadowRoot.querySelector('.view-details-btn');
    if (button) {
      button.addEventListener('click', () => this._navigateToDetails());
    }
  }

  _navigateToDetails() {
    const path = `/${this.getPageType()}`;
    history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  disconnectedCallback() {
    // Limpa todas as inscrições ao desconectar o componente
    this.unsubscribeCallbacks.forEach(callback => callback());
    this.unsubscribeCallbacks.clear();
  }
}

if (!customElements.get('app-total-card')) {
  customElements.define('app-total-card', TotalCard);
}

export default TotalCard;
