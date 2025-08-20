import { getShowValues, toggleShowValues, subscribeToVisibility, unsubscribeFromVisibility } from '../../store/visibilityStore.js';
import { formatCurrencyCode, currencyOptions } from '../../utils/currency.js';
import { i18n } from '../../i18n/i18n.js';
import { subscribeToTotals, unsubscribeFromTotals, updateTotals } from '../../store/totalsStore.js';
import '../modals/totals-modal.js';

export class BasePageHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleVisibilityChange = () => this.render();
    this.handleTotalsChange = ({ totals, estimatedTotals, hasRecurring, itemsCount, recurrencesCount }) => {
      this.totalValues = totals;
      this.estimatedTotals = estimatedTotals;
      this.hasRecorrentes = hasRecurring;
      this.itemsCount = itemsCount;
      this.recurrencesCount = recurrencesCount;
      this.hasItems = Object.keys(totals).length > 0;
      this.showFilters = false;

      if (!this.shadowRoot.querySelector('.header')) {
        this.render();
        return;
      }

      const showValues = getShowValues();
      const currentCurrency = this.getMostRelevantCurrency();
      const totalElement = this.shadowRoot.querySelector('#total em');
      const estimatedTotalElement = this.shadowRoot.querySelector('#estimated-total em');
      const totalsContainer = this.shadowRoot.querySelector('.totals-container');
      const filterComponent = this.shadowRoot.querySelector(this.filterComponent);
      const currencyLabel = this.shadowRoot.querySelector('.currency-label');
      const currencyInfo = currencyOptions.find(opt => opt.value === currentCurrency) || { label: currentCurrency };

      if (totalsContainer) {
        totalsContainer.style.display = this.hasItems ? 'flex' : 'none';
      }

      if (filterComponent) {
        const totalItems = this.getTotalItemsCount();
        filterComponent.style.display = this.hasItems && totalItems > 0 ? 'block' : 'none';
      }

      if (currencyLabel) {
        currencyLabel.innerHTML = `
          <app-icon>currency_exchange</app-icon>
          ${currencyInfo.label}
        `;
      }

      if (totalElement) {
        totalElement.textContent = showValues ?
          formatCurrencyCode(this.totalValues[currentCurrency] || 0, currentCurrency) :
          '••••••••';
      }

      if (estimatedTotalElement && this.hasRecorrentes && this.estimatedTotals[currentCurrency]) {
        estimatedTotalElement.textContent = showValues ?
          formatCurrencyCode(this.estimatedTotals[currentCurrency] || 0, currentCurrency) :
          '••••••••';
      }
    };
    this.totalValues = {};
    this.estimatedTotals = {};
    this.hasItems = false;
    this.itemsCount = {};
    this.hasRecorrentes = false;
    this.recurrencesCount = {};
    this.title = '';
    this.icon = '';
    this.addButtonLabel = '';
    this.filterComponent = '';
  }

  static get observedAttributes() {
    return ['title', 'icon', 'add-button-label', 'filter-component'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'title':
          this.title = newValue;
          break;
        case 'icon':
          this.icon = newValue;
          break;
        case 'add-button-label':
          this.addButtonLabel = newValue;
          break;
        case 'filter-component':
          this.filterComponent = newValue;
          break;
      }
      this.render();
    }
  }

  connectedCallback() {
    const pageType = this.getAttribute('page-type') || 'all';

    this.isExpenses = pageType === 'despesas';

    subscribeToVisibility(this.handleVisibilityChange);
    subscribeToTotals(this.handleTotalsChange);
    updateTotals(pageType).catch(console.error);
    this.render();

    this._i18nUnsubscribe = i18n.addObserver(() => {
      if (typeof this.update === 'function') {
        this.update();
      } else {
        this.render();
      }
    });
  }

  disconnectedCallback() {
    unsubscribeFromVisibility(this.handleVisibilityChange);
    unsubscribeFromTotals(this.handleTotalsChange);
    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
  }

  setTotalValue(totalValues) {
    this.totalValues = totalValues;
    this.render();
  }

  setEstimatedTotal(estimatedTotals) {
    this.estimatedTotals = estimatedTotals;
    this.render();
  }

  setHasItems(hasItems) {
    this.hasItems = hasItems;
    this.render();
  }

  setItemsCount(count) {
    this.itemsCount = count;

    this.render();
  }

  setHasRecorrentes(hasRecorrentes) {
    this.hasRecorrentes = hasRecorrentes;
    this.render();
  }

  getTotalItemsCount() {
    const count = Object.values(this.itemsCount || {}).reduce((sum, count) => sum + (count || 0), 0);

    return count;
  }

  showAllTotals() {

    const modal = document.createElement('app-totals-modal');
    modal.setAttribute('total-values', JSON.stringify(this.totalValues));
    modal.setAttribute('estimated-totals', JSON.stringify(this.estimatedTotals));
    modal.setAttribute('has-recorrentes', this.hasRecorrentes);
    modal.setAttribute('items-count', JSON.stringify(this.itemsCount));
    modal.setAttribute('recurrences-count', JSON.stringify(this.recurrencesCount));
    modal.setAttribute('page-type', this.getAttribute('page-type') || 'all');
    document.body.appendChild(modal);
    modal.open();
  }

  getMostRelevantCurrency() {
    const currentCurrency = i18n.getTranslation('common.currency') || 'BRL';
    const nonZeroCurrencies = Object.keys(this.totalValues).filter(
      (currency) => Number(this.totalValues[currency]) !== 0
    );

    if (nonZeroCurrencies.includes(currentCurrency) && this.totalValues[currentCurrency] !== 0) {
      return currentCurrency;
    }

    if (nonZeroCurrencies.length > 0) {
      return nonZeroCurrencies.reduce((maxCurrency, currency) => {
        const currentValue = Math.abs(Number(this.totalValues[currency]));
        const maxValue = Math.abs(Number(this.totalValues[maxCurrency]));
        return currentValue > maxValue ? currency : maxCurrency;
      });
    }

    return currentCurrency;
  }

  render() {
    const showValues = getShowValues();
    const currentCurrency = this.getMostRelevantCurrency();
    const currencyInfo = currencyOptions.find(opt => opt.value === currentCurrency) || { label: currentCurrency };
    const nonZeroCurrencies = Object.keys(this.totalValues).filter(
      (currency) => Number(this.totalValues[currency]) !== 0
    );

    const hasMultipleCurrencies = nonZeroCurrencies.length > 1;
    const hasMultipleItems = this.getTotalItemsCount() > 1;


    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          top: 0;
          background: linear-gradient(to bottom, var(--background-color) 95%, var(--background-gradient-transparent) 100%);
          padding: 2rem 2rem 1rem 2rem;
          z-index: 10;
          backdrop-filter: blur(8px);
        }

        .header {
          display: flex;
          flex: 1;
          justify-content: space-between;
          flex-direction: column;
          width: 100%;
        }

        .header > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          flex: 1;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          justify-content: space-between;
        }

        .actions-right {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .page-title {
          font-size: 1.75rem;
          margin: 0;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          flex: 1;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1.5rem;
        }

        .totals-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.25rem 0;
          width: 100%;
          animation: slideIn 0.3s ease-out;
        }

        .currency-total {
          display: flex;
          flex-direction: row-reverse;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 8px;
          background: var(--background-card-color);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          height: 100%;
          min-height: 100px;
          width: 100%;
          box-sizing: border-box;
          justify-content: center;
        }

        .currency-total > div {
          display: flex;
          gap: 0.5rem;
          flex: 1;
          justify-content: center;
        }

        .currency-total-content {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
          align-items: center;
        }

        .currency-label {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          margin-bottom: 0.15rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .currency-label app-icon {
          font-size: 1rem;
          color: var(--color-text-secondary);
        }

        #total, #estimated-total {
          font-size: 1rem;
          color: var(--color-text);
          margin: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          gap: 0.35rem;
        }

        #total app-icon, #estimated-total app-icon {
          font-size: 1.1rem;
          color: var(--color-text);
        }

        #total em, #estimated-total em {
          font-size: 1.35rem;
          font-weight: bold;
          font-style: normal;
          color: ${this.isExpenses ? 'var(--color-danger)' : 'var(--color-success)'};
          margin-left: 0.35rem;
          white-space: nowrap;
          flex-shrink: 0;
        }

        #estimated-total em {
          color: ${this.isExpenses ? 'var(--color-text)' : 'var(--color-primary)'};
        }

        #toggle-visibility {
          cursor: pointer;
          padding: 0.35rem;
          border-radius: 50%;
          transition: all 0.2s ease;
          margin-left: auto;
        }

        #toggle-filters {
          cursor: pointer;
          padding: 0.35rem;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-secondary);
        }

        .filters-container {
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .filters-container.hidden {
          max-height: 0;
          opacity: 0;
          margin: 0;
          padding: 0;
        }

        .filters-container.visible {
          max-height: 500px;
          opacity: 1;
        }

        @media (max-width: 1280px) {
          .currency-total {
            flex-direction: column;
          }
        }

        @media (max-width: 800px) {
          :host {
            padding: 0.75rem;
          }
          .page-title {
            font-size: 1.35rem;
            padding-bottom: 0.5rem;
          }
          .currency-total {
            min-height: 100px;
          }
          #total, #estimated-total {
            font-size: 0.9rem;
          }
          #total em, #estimated-total em {
            font-size: 1.15rem;
          }
          app-button .label {
            display: none;
          }
          #toggle-filters .label {
            display: none;
          }
        }

        @media (max-width: 480px) {
          :host {
            padding: 0.5rem;
          }
          .header {
            gap: 0.5rem;
          }
          .header > div {
            gap: 0.5rem;
          }
          .page-title {
            font-size: 1.15rem;
          }
          .currency-total {
            padding: 0.6rem;
          }
          .currency-label {
            font-size: 0.8rem;
          }
          #total em, #estimated-total em {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 600px) {
          .currency-total {
            padding: 0;
            background: transparent;
            box-shadow: none;
            min-height: 0;
          }
          .currency-label {
            display: none !important;
          }
          .currency-total-content {
            flex-direction: column;
          }
        }
      </style>
      <div class="header">
        <div>
          <h1 class="page-title">
            <app-icon aria-hidden="true">${this.icon}</app-icon>
            ${this.title}
            ${this.hasItems ? `
              <app-icon id="toggle-visibility" title="${i18n.getTranslation('home.balance.show')}" role="button" tabindex="0">
                ${showValues ? 'visibility' : 'visibility_off'}
              </app-icon>
            ` : ''}
          </h1>
          ${this.hasItems && this.getTotalItemsCount() > 1 ? `
            <div class="totals-container">
              <div class="currency-total">
                <div class="currency-label">
                  <app-icon>currency_exchange</app-icon>
                  ${currencyInfo.label}
                </div>
                <div class="currency-total-content">
                    <div>
                      <p id="total" aria-live="polite">
                        <app-icon>${this.isExpenses ? 'trending_down' : 'attach_money'}</app-icon>
                        ${i18n.getTranslation('home.total')}:
                        <em>${showValues ? formatCurrencyCode(this.totalValues[currentCurrency] || 0, currentCurrency) : '••••••••'}</em>
                      </p>
                    </div>
                  ${this.hasRecorrentes && this.estimatedTotals[currentCurrency] ? `
                    <div>
                      <p id="estimated-total" aria-live="polite">
                        <app-icon>${this.isExpenses ? 'calendar_month' : 'trending_up'}</app-icon>
                        ${i18n.getTranslation('home.estimated')}:
                        <em>${showValues ? formatCurrencyCode(this.estimatedTotals[currentCurrency] || 0, currentCurrency) : '••••••••'}</em>
                      </p>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          ` : ''}
          <div class="actions">
            <app-button
              id="add"
              role="button"
              aria-label="${i18n.getTranslation('common.actions.add')}"
              tabindex="0"
            >
              <app-icon aria-hidden="true">add</app-icon>
              <span class="label">${this.addButtonLabel}</span>
            </app-button>
            <div class="actions-right">
              ${hasMultipleCurrencies ? `
                <app-button
                  id="show-all-totals"
                  role="button"
                  aria-label="${i18n.getTranslation('reports.summary.title')}"
                  tabindex="0"
                  variant="text"
                >
                  <app-icon>list</app-icon>
                  <span class="label">${i18n.getTranslation('reports.summary.title')}</span>
                </app-button>
              ` : ''}
              ${hasMultipleItems ? `
                <app-button
                  id="selection-mode"
                  role="button"
                  aria-label="${i18n.getTranslation('common.actions.select')}"
                  tabindex="0"
                  variant="text"
                >
                  <app-icon>select_all</app-icon>
                  <span class="label">${i18n.getTranslation('common.actions.select')}</span>
                </app-button>
                <app-button
                  id="toggle-filters"
                  role="button"
                  aria-label="${this.showFilters ? i18n.getTranslation('common.filters.hide') : i18n.getTranslation('common.filters.show')}"
                  tabindex="0"
                  title="${this.showFilters ? i18n.getTranslation('common.filters.hide') : i18n.getTranslation('common.filters.show')}"
                  variant="text"
                >
                  <app-icon>${this.showFilters ? 'filter_list_off' : 'filter_list'}</app-icon>
                  <span class="label">${this.showFilters ? i18n.getTranslation('common.filters.hide') : i18n.getTranslation('common.filters.show')}</span>
                </app-button>
              ` : ''}
            </div>
          </div>
        </div>
        ${hasMultipleItems ? `
          <div class="filters-container ${this.showFilters ? 'visible' : 'hidden'}">
            <${this.filterComponent}></${this.filterComponent}>
          </div>
        ` : ''}
      </div>
    `;

    const toggleVisibilityIcon = this.shadowRoot.querySelector('#toggle-visibility');
    if (toggleVisibilityIcon) {
      toggleVisibilityIcon.addEventListener('click', toggleShowValues);
    }

    const addButton = this.shadowRoot.querySelector('#add');
    if (addButton) {
      addButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('add-item', { bubbles: true, composed: true }));
      });
    }

    const selectionModeButton = this.shadowRoot.querySelector('#selection-mode');
    if (selectionModeButton) {
      selectionModeButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('toggle-selection-mode', { bubbles: true, composed: true }));
      });
    }

    const showAllTotalsButton = this.shadowRoot.querySelector('#show-all-totals');
    if (showAllTotalsButton) {
      showAllTotalsButton.addEventListener('click', () => this.showAllTotals());
    }

    const toggleFiltersButton = this.shadowRoot.querySelector('#toggle-filters');
    if (toggleFiltersButton) {
      toggleFiltersButton.addEventListener('click', () => {
        this.showFilters = !this.showFilters;
        this.render();
      });
    }
  }
}

export default BasePageHeader;
