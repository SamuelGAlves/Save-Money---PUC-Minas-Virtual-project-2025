import authService from '../../services/auth.js';
import {
  getShowValues,
  toggleShowValues,
  subscribeToVisibility,
  unsubscribeFromVisibility,
} from '../../store/visibilityStore.js';
import { i18n } from '../../i18n/i18n.js';
import {
  subscribeToHomeTotals,
  unsubscribeFromHomeTotals,
  updateHomeTotals,
} from '../../store/homeTotalsStore.js';
import { formatCurrencyCode } from '../../utils/currency.js';
import './components/recurring-info.js';
import './components/total-card.js';

class HomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.user = null;

  }

  async connectedCallback() {

    const session = await authService.getLoggedUser();
    this.user = session?.user;


    this.render();
    this.setupToggleSaldo();
    this._i18nUnsubscribe = i18n.addObserver(() => {

      this.render();
      this.setupToggleSaldo();
    });

    // Inscreve para receber atualizações dos totais
    this._totalsObserver = (state) => {

      this.totals = {
        investments: state.totals.investimentos || {},
        income: state.totals.receitas || {},
        expenses: state.totals.despesas || {},
      };
      this.estimatedTotals = {
        investments: state.estimatedTotals.investimentos || {},
        income: state.estimatedTotals.receitas || {},
        expenses: state.estimatedTotals.despesas || {},
      };
      this.itemsCount = {
        investments: state.itemsCount.investimentos || {},
        income: state.itemsCount.receitas || {},
        expenses: state.itemsCount.despesas || {},
      };
      this.recurrencesCount = {
        investments: state.recurrencesCount.investimentos || {},
        income: state.recurrencesCount.receitas || {},
        expenses: state.recurrencesCount.despesas || {},
      };
      this.hasRecurring = state.hasRecurring;
      this.render();
    };
    subscribeToHomeTotals(this._totalsObserver);


    // Inscreve para receber atualizações de visibilidade
    this._visibilityObserver = () => {

      this.render();
    };
    subscribeToVisibility(this._visibilityObserver);

    // Atualiza os totais iniciais
    try {

      await updateHomeTotals();
    } catch (error) {
      console.error('[HomePage] Erro ao atualizar totais iniciais:', error);
    }
  }

  disconnectedCallback() {

    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
    if (this._totalsObserver) {
      unsubscribeFromHomeTotals(this._totalsObserver);
    }
    if (this._visibilityObserver) {
      unsubscribeFromVisibility(this._visibilityObserver);
    }
  }

  formatValue(value, currency) {
    const showValues = getShowValues();
    if (!showValues) return '••••••••';

    if (typeof value !== 'number') {
      console.warn('[HomePage] Valor inválido para formatação:', value);
      return formatCurrencyCode(0, currency);
    }

    return formatCurrencyCode(value, currency);
  }

  getMostRelevantCurrency() {
    const currentCurrency = i18n.getTranslation('common.currency') || 'BRL';
    const allCurrencies = new Set([
      ...Object.keys(this.totals.investments || {}).filter(
        (currency) => this.totals.investments[currency] > 0
      ),
      ...Object.keys(this.totals.income || {}).filter(
        (currency) => this.totals.income[currency] > 0
      ),
      ...Object.keys(this.totals.expenses || {}).filter(
        (currency) => this.totals.expenses[currency] > 0
      ),
    ]);

    const nonZeroCurrencies = Array.from(allCurrencies);

    if (nonZeroCurrencies.includes(currentCurrency)) {
      return currentCurrency;
    }

    if (nonZeroCurrencies.length > 0) {
      return nonZeroCurrencies[0];
    }

    return currentCurrency;
  }

  setupToggleSaldo() {

    const toggleBtn = this.shadowRoot.querySelector('#toggleSaldoBtn');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('app-icon');
    if (!icon) return;

    const update = () => {
      const showValues = getShowValues();
      icon.textContent = showValues ? 'visibility' : 'visibility_off';
      toggleBtn.setAttribute(
        'aria-label',
        showValues
          ? i18n.getTranslation('home.balance.hide')
          : i18n.getTranslation('home.balance.show')
      );
    };

    // Remove o listener antigo se existir
    const oldListener = toggleBtn._clickListener;
    if (oldListener) {
      toggleBtn.removeEventListener('click', oldListener);
    }

    // Cria e armazena o novo listener
    const clickListener = () => {

      toggleShowValues();
      update();
      this.render();
    };
    toggleBtn._clickListener = clickListener;
    toggleBtn.addEventListener('click', clickListener);

    update();
  }

  render() {


    const investmentsTotals = this.totals?.investments || {};
    const incomeTotals = this.totals?.income || {};
    const expensesTotals = this.totals?.expenses || {};

    const investmentsEstimated = this.estimatedTotals?.investments || {};
    const incomeEstimated = this.estimatedTotals?.income || {};
    const expensesEstimated = this.estimatedTotals?.expenses || {};

    const investmentsItemsCount = this.itemsCount?.investments || {};
    const incomeItemsCount = this.itemsCount?.income || {};
    const expensesItemsCount = this.itemsCount?.expenses || {};

    const investmentsRecurrencesCount = this.recurrencesCount?.investments || {};
    const incomeRecurrencesCount = this.recurrencesCount?.income || {};
    const expensesRecurrencesCount = this.recurrencesCount?.expenses || {};

    // Verifica se há valores para mostrar em cada card
    const hasInvestments =
      Object.values(investmentsTotals).some((value) => value > 0) ||
      Object.values(investmentsEstimated).some((value) => value > 0);
    const hasIncome =
      Object.values(incomeTotals).some((value) => value > 0) ||
      Object.values(incomeEstimated).some((value) => value > 0);
    const hasExpenses =
      Object.values(expensesTotals).some((value) => value < 0) ||
      Object.values(expensesEstimated).some((value) => value < 0);



    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          width: 100%;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--text-color);
        }

        .container {
          display: flex;
          flex-direction: column;
          padding: 2rem;
          border-radius: 1rem;
          width: 100%;
          box-sizing: border-box;
        }

        .page-title {
          font-size: 2rem;
          margin-top: 0;
          margin-bottom: 0;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        p {
          font-size: 1.2rem;
          margin: 0.5rem 0;
        }

        .header {
          display: flex;
          align-items: self-start;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1.5rem;
          margin-bottom: 1rem;
        }

        .header button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text);
          display: flex;
          align-items: center;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .header button:hover {
          background-color: var(--color-background-light);
        }

        .financial-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          width: 100%;
          box-sizing: border-box;
        }

        .empty-state {
          background-color: var(--color-background-light);
          border-radius: 1rem;
        }

        .empty-state h2 {
          margin-top: 0;
          font-size: 1.5rem;
          color: var(--color-text);
        }

        .empty-state p {
          font-size: 1.1rem;
          color: var(--color-text-secondary);
          margin-bottom: 1.5rem;
        }

        .empty-state-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .empty-state-actions app-button {
          --app-button-padding: 0.75rem 1.5rem;
        }

        @media (max-width: 768px) {
          .financial-summary {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.25rem;
          }
        }


        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .header {
            padding-bottom: .5rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .contact-info {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          p {
            font-size: 1rem;
          }

          .financial-summary {
            grid-template-columns: 1fr;
            gap: 1rem;
            margin: 0.5rem 0;
          }
        }
      </style>

      <div class="container">
        <div class="header">
          <h1 class="page-title">${i18n.getTranslation('home.welcome', {
            name: this.user?.nome || i18n.getTranslation('home.user'),
          })}</h1>
          ${hasInvestments || hasIncome || hasExpenses ? `
            <button id="toggleSaldoBtn" aria-label="${i18n.getTranslation('home.balance.hide')}">
              <app-icon>${getShowValues() ? 'visibility' : 'visibility_off'}</app-icon>
            </button>
          ` : ''}
        </div>

        <div class="financial-summary">
          ${
            hasInvestments
              ? `
            <app-total-card
              title="${i18n.getTranslation('home.investments.title')}"
              type="investments"
              totals='${JSON.stringify(investmentsTotals)}'
              estimated-totals='${JSON.stringify(investmentsEstimated)}'
              items-count='${JSON.stringify(investmentsItemsCount)}'
              recurrences-count='${JSON.stringify(investmentsRecurrencesCount)}'
            ></app-total-card>
          `
              : ''
          }

          ${
            hasIncome
              ? `
            <app-total-card
              title="${i18n.getTranslation('home.income.title')}"
              type="income"
              totals='${JSON.stringify(incomeTotals)}'
              estimated-totals='${JSON.stringify(incomeEstimated)}'
              items-count='${JSON.stringify(incomeItemsCount)}'
              recurrences-count='${JSON.stringify(incomeRecurrencesCount)}'
            ></app-total-card>
          `
              : ''
          }

          ${
            hasExpenses
              ? `
            <app-total-card
              title="${i18n.getTranslation('home.expenses.title')}"
              type="expenses"
              totals='${JSON.stringify(expensesTotals)}'
              estimated-totals='${JSON.stringify(expensesEstimated)}'
              items-count='${JSON.stringify(expensesItemsCount)}'
              recurrences-count='${JSON.stringify(expensesRecurrencesCount)}'
            ></app-total-card>
          `
              : ''
          }
        </div>

        ${
          !hasInvestments && !hasIncome && !hasExpenses
            ? `
          <div class="empty-state">
            <h2>${i18n.getTranslation('home.empty.title')}</h2>
            <p>${i18n.getTranslation('home.empty.description')}</p>
            <div class="empty-state-actions">
              <app-button href="/investimentos" variant="primary">
                <app-icon>add</app-icon>
                ${i18n.getTranslation('home.empty.add_investment')}
              </app-button>
              <app-button href="/receitas" variant="primary">
                <app-icon>add</app-icon>
                ${i18n.getTranslation('home.empty.add_income')}
              </app-button>
              <app-button href="/despesas" variant="primary">
                <app-icon>add</app-icon>
                ${i18n.getTranslation('home.empty.add_expense')}
              </app-button>
            </div>
          </div>
        `
            : ''
        }

        ${this.hasRecurring ? '<app-recurring-info></app-recurring-info>' : ''}
      </div>
    `;

    this.setupToggleSaldo();
  }
}

if (!customElements.get('home-page')) {
  customElements.define('home-page', HomePage);
}

export default HomePage;
