import ModalBase from "./modal.js";
import { getShowValues } from '../../store/visibilityStore.js';
import { formatCurrencyCode, currencyOptions } from '../../utils/currency.js';
import { i18n } from '../../i18n/i18n.js';

class TotalsModal extends ModalBase {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.pageType = 'all';
    this.render();
  }

  static get observedAttributes() {
    return ['total-values', 'estimated-totals', 'has-recorrentes', 'items-count', 'recurrences-count', 'page-type'];
  }

  attributeChangedCallback(name, oldValue, newValue) {

    if (oldValue !== newValue) {
      if (name === 'page-type') {
        this.pageType = newValue;
      }
      this.render();
    }
  }

  getSortedCurrencies(totalValues) {
    const currentCurrency = i18n.getTranslation('common.currency') || 'BRL';
    const currencies = Object.keys(totalValues).filter(currency => totalValues[currency] !== 0);
    const otherCurrencies = currencies.filter(currency => currency !== currentCurrency);
    const sortedOtherCurrencies = otherCurrencies.sort((a, b) => {
      const valueA = totalValues[a] || 0;
      const valueB = totalValues[b] || 0;
      return valueB - valueA;
    });
    return [currentCurrency, ...sortedOtherCurrencies];
  }

  getIconForType() {
    switch (this.pageType) {
      case 'despesas':
        return 'trending_down';
      case 'investimentos':
        return 'trending_up';
      default:
        return 'savings';
    }
  }

  getEstimatedIconForType() {
    switch (this.pageType) {
      case 'despesas':
        return 'calendar_month';
      case 'investimentos':
        return 'trending_up';
      default:
        return 'trending_up';
    }
  }

  getValueClass() {
    switch (this.pageType) {
      case 'despesas':
        return 'expense';
      case 'investimentos':
        return 'investment';
      default:
        return 'income';
    }
  }

  render() {
    const showValues = getShowValues();
    const totalValues = JSON.parse(this.getAttribute('total-values') || '{}');
    const estimatedTotals = JSON.parse(this.getAttribute('estimated-totals') || '{}');
    const hasRecorrentes = this.getAttribute('has-recorrentes') === 'true';
    const itemsCount = JSON.parse(this.getAttribute('items-count') || '{}');
    const recurrencesCount = JSON.parse(this.getAttribute('recurrences-count') || '{}');
    const sortedCurrencies = this.getSortedCurrencies(totalValues);

    const totalItems = Object.entries(itemsCount)
      .filter(([currency]) => totalValues[currency] !== 0)
      .reduce((sum, [_, count]) => sum + count, 0);

    const totalRecurrences = Object.entries(recurrencesCount)
      .filter(([currency]) => totalValues[currency] !== 0)
      .reduce((sum, [_, count]) => sum + count, 0);

    const hasAnyRecurrences = totalRecurrences > 0;





    this.shadowRoot.innerHTML = `
      <style>
        #modal {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          justify-content: center;
          align-items: center;
          z-index: 999;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(5px) grayscale(1);
        }

        .modal-content {
          background-color: var(--background-color);
          padding: 1rem;
          margin: 1rem;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          max-height: 70vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.3s ease;
        }

        h2 {
          margin-top: 0;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
          color: var(--color-text);
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .summary {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--background-card-color);
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }

        .summary-details {
          display: flex;
          justify-content: center;
          gap: 1rem;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .summary-detail {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .summary-detail app-icon {
          font-size: 1.1rem;
        }

        .totals-list {
          flex: 1;
          max-height: calc(70vh - 250px);
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          margin: 0.25rem 0;
          gap: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .currency-total {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 8px;
          background: var(--background-card-color);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 320px;
        }

        .currency-label {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .total-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .total-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .total-label {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .total-value {
          font-size: 1rem;
          color: var(--color-text);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .total-value em {
          font-size: 1.35rem;
          font-weight: bold;
          font-style: normal;
          margin-left: 0.35rem;
        }

        .total-value.expense em {
          color: var(--color-danger);
        }

        .total-value.income em {
          color: var(--color-secondary);
        }

        .total-value.investment em {
          color: var(--color-success);
        }

        .estimated-value em {
          color: var(--color-primary);
        }

        .estimated-value.expense em {
          color: var(--color-text);
        }

        .currency-details {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-color);
        }

        .currency-detail {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .button-group {
          display: flex;
          justify-content: center;
          margin-top: 0.75rem;
        }

        .button-group app-button {
          min-width: 120px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          .modal-content {
            padding: 1rem;
            margin: 1rem;
          }
        }
      </style>
      <div id="modal" role="dialog" aria-labelledby="modal-title">
        <div class="modal-content">
          <h2>
            <app-icon>payments</app-icon>
            Todos os Totais
          </h2>

          <div class="summary">
            <div class="summary-details">
              <div class="summary-detail">
                <app-icon>list</app-icon>
                ${totalItems} itens
              </div>
              ${hasAnyRecurrences ? `
                <div class="summary-detail">
                  <app-icon>repeat</app-icon>
                  ${totalRecurrences} recorrências
                </div>
              ` : ''}
            </div>
          </div>

          <div class="totals-list">
            ${sortedCurrencies.map(currency => {
              const currencyInfo = currencyOptions.find(opt => opt.value === currency) || { label: currency };
              const currencyItems = itemsCount[currency] || 0;
              const currencyRecurrences = recurrencesCount[currency] || 0;
              const hasCurrencyRecurrences = currencyRecurrences > 0;



              return `
                <div class="currency-total">
                  <div class="currency-label">
                    <app-icon>currency_exchange</app-icon>
                    ${currencyInfo.label}
                  </div>
                  <div class="total-info">
                    <div class="total-row">
                      <div class="total-label">
                        <app-icon>${this.getIconForType()}</app-icon>
                        Total Geral
                      </div>
                      <div class="total-value ${this.getValueClass()}" aria-live="polite">
                        <em>${showValues ? formatCurrencyCode(totalValues[currency] || 0, currency) : '••••••••'}</em>
                      </div>
                    </div>
                    ${hasCurrencyRecurrences && estimatedTotals[currency] ? `
                      <div class="total-row">
                        <div class="total-label">
                          <app-icon>${this.getEstimatedIconForType()}</app-icon>
                          Total Estimado (Recorrências)
                        </div>
                        <div class="total-value estimated-value ${this.pageType === 'despesas' ? 'expense' : ''}" aria-live="polite">
                          <em>${showValues ? formatCurrencyCode(estimatedTotals[currency] || 0, currency) : '••••••••'}</em>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                  <div class="currency-details">
                    <div class="currency-detail">
                      <app-icon>list</app-icon>
                      ${currencyItems} itens
                    </div>
                    ${hasCurrencyRecurrences ? `
                      <div class="currency-detail">
                        <app-icon>repeat</app-icon>
                        ${currencyRecurrences} recorrências
                      </div>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="button-group">
            <app-button id="close" variant="primary">
              <app-icon size="small">done</app-icon>
              Ok, Entendi
            </app-button>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('#close').onclick = () => this.close();
  }
}

if (!customElements.get('app-totals-modal')) {
  customElements.define('app-totals-modal', TotalsModal);
}

export default TotalsModal;
