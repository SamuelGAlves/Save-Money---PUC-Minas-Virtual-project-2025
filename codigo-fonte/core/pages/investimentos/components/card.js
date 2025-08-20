import BaseCard from '../../../components/cards/base-card.js';
import { formatCurrencyCode } from '../../../utils/currency.js';
import { formatFullDate } from '../../../utils/date.js';
import { getShowValues } from '../../../store/visibilityStore.js';
import { i18n } from '../../../i18n/i18n.js';

class InvestmentCard extends BaseCard {
  constructor() {
    super();
    this._i18nCallback = () => {
      if (this.isConnected) {
        this.render();
      }
    };
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'interestRate', 'interestType', 'period'];
  }

  getStatus(startDate, endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate + 'T00:00:00');
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate + 'T00:00:00') : null;
    if (end) {
      end.setHours(0, 0, 0, 0);
    }

    if (end && today > end) {
      return { text: i18n.getTranslation('investments.card.status.finished'), className: 'status-finished' };
    }

    if (start > today) {
      const diffTime = Math.abs(start - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { text: i18n.getTranslation('investments.status.startsIn', { days: diffDays }), className: 'status-future' };
    }

    if (end) {
      const diffTime = Math.abs(end - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { text: i18n.getTranslation('investments.status.endsIn', { days: diffDays }), className: 'status-active' };
    }

    return { text: i18n.getTranslation('investments.card.status.active'), className: 'status-active' };
  }

  calculateRentability(value, startDate, interestRate = 0.5, interestType = 'none', endDate = null) {
    if (!value || !startDate || interestType === 'none') {
      return '';
    }

    const today = new Date();
    const start = new Date(startDate + 'T00:00:00');
    const diffInDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));

    // Ajustar a taxa de juros para o período diário
    let dailyRate;
    if (interestType === 'month') {
      dailyRate = interestRate / 100 / 30; // Taxa mensal convertida para diária
    } else if (interestType === 'year') {
      dailyRate = interestRate / 100 / 365; // Taxa anual convertida para diária
    } else {
      dailyRate = 0; // Caso o tipo seja inválido
    }

    // Calcular a rentabilidade atual
    let rentabilityHTML = '';
    let totalWithRentability = value;
    if (diffInDays > 0) {
      const rentability = Number((value * (dailyRate * diffInDays)).toFixed(2));
      if (rentability > 0) {
        totalWithRentability = Number((value + rentability).toFixed(2));
        rentabilityHTML = `
          <p class="rentability">
            <strong><app-icon margin="0 .5rem 0 0">trending_up</app-icon> ${i18n.getTranslation('investments.card.rentability.current')}:</strong> ${
              getShowValues() ? formatCurrencyCode(rentability, this.getAttribute('currencyType') || 'BRL') : '••••••••'
            }
          </p>
          <p class="rentability-total">
            <strong><app-icon margin="0 .5rem 0 0">calculate</app-icon> ${i18n.getTranslation('investments.card.rentability.total')}:</strong> ${
              getShowValues()
                ? formatCurrencyCode(totalWithRentability, this.getAttribute('currencyType') || 'BRL')
                : '••••••••'
            }
          </p>
        `;
      }
    }

    // Calcular a expectativa de rentabilidade
    let expectedRentabilityHTML = '';
    let totalWithExpectedRentability = value;

    const end = endDate ? new Date(endDate + 'T00:00:00') : new Date(start.getTime() + (365 * 24 * 60 * 60 * 1000));
    const totalDiffInDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));

    if (totalDiffInDays > 0) {
      const expectedRentability = Number((value * (dailyRate * totalDiffInDays)).toFixed(2));
      if (expectedRentability > 0) {
        totalWithExpectedRentability = Number((value + expectedRentability).toFixed(2));
        expectedRentabilityHTML = `
          <p class="expected-rentability">
            <strong><app-icon margin="0 .5rem 0 0">trending_up</app-icon> ${i18n.getTranslation('investments.card.rentability.expected')}:</strong> ${
              getShowValues()
                ? formatCurrencyCode(expectedRentability, this.getAttribute('currencyType') || 'BRL')
                : '••••••••'
            }
          </p>
          <p class="expected-rentability-total">
            <strong><app-icon margin="0 .5rem 0 0">calculate</app-icon> ${i18n.getTranslation('investments.card.rentability.expectedTotal')}:</strong> ${
              getShowValues()
                ? formatCurrencyCode(totalWithExpectedRentability, this.getAttribute('currencyType') || 'BRL')
                : '••••••••'
            }
          </p>
        `;
      }
    }

    return `
      ${rentabilityHTML}
      ${expectedRentabilityHTML}
    `;
  }

  render() {
    const title = this.getAttribute('title') || i18n.getTranslation('investments.title');
    const value = parseFloat(this.getAttribute('value')) || 0;
    const date = this.getAttribute('date');
    const period = this.getAttribute('period');
    const interestRate = parseFloat(this.getAttribute('interestRate')) || 0.5;
    const interestType = this.getAttribute('interestType') || 'month';
    const currencyType = this.getAttribute('currencyType') || 'BRL';

    // Verificar se cada atributo existe antes de renderizá-lo
    const valueHTML = value
      ? `<p><strong><app-icon margin="0 .5rem 0 0">payments</app-icon> ${i18n.getTranslation('investments.card.value')}:</strong> ${
          getShowValues() ? formatCurrencyCode(value, currencyType) : '••••••••'
        }</p>`
      : '';
    const dateHTML = date
      ? `<p><strong><app-icon margin="0 .5rem 0 0">today</app-icon> ${i18n.getTranslation('investments.card.date')}:</strong> ${formatFullDate(
          new Date(date + 'T00:00:00')
        )}</p>`
      : '';
    const periodHTML = period
      ? `<p><strong><app-icon margin="0 .5rem 0 0">event</app-icon> ${i18n.getTranslation('investments.card.period')}:</strong> ${formatFullDate(
          new Date(period + 'T00:00:00')
        )}</p>`
      : '';
    const interestRateHTML =
      interestType === 'none'
        ? `<p><strong><app-icon margin="0 .5rem 0 0">percent</app-icon> ${i18n.getTranslation('investments.card.interestRate')}:</strong> ${i18n.getTranslation('investments.card.interestTypes.none')}</p>`
        : `
          <p><strong><app-icon margin="0 .5rem 0 0">percent</app-icon> ${i18n.getTranslation('investments.card.interestRate')}:</strong> ${interestRate.toFixed(
            2
          )}% ${
            interestType === 'month'
              ? i18n.getTranslation('investments.card.interestTypes.month')
              : interestType === 'year'
              ? i18n.getTranslation('investments.card.interestTypes.year')
              : ''
          }</p>
        `;

    // Determinar o status
    const status = this.getStatus(date, period);

    // Calcular a rentabilidade
    const rentabilityHTML =
      interestType !== 'none'
        ? this.calculateRentability(
            value,
            date,
            interestRate,
            interestType,
            period
          )
        : '';

    // Chamar o render do pai
    super.render();

    // Adicionar estilos específicos de investimento
    const style = document.createElement('style');
    style.textContent = `
      .card.finished {
        background-color: var(--status-finished-color-light);
        border: 2px solid var(--status-finished-color);
      }
      .card.active {
        background-color: var(--status-received-color-light);
        border: 2px solid var(--status-active-color);
      }
      .card.future {
        background-color: var(--status-future-color-light);
        border: 2px solid var(--status-future-color);
      }
      .status-finished {
        background-color: var(--status-finished-color);
      }
      .status-active {
        background-color: var(--status-active-color);
      }
      .status-future {
        background-color: var(--status-future-color);
      }
      .rentability, .rentability-total, .expected-rentability, .expected-rentability-total {
        margin-top: 0.5rem;
        font-weight: bold;
      }
      .rentability {
        color: var(--rentability-color);
      }
      .rentability-total {
        color: var(--rentability-total-color);
      }
      .expected-rentability {
        color: var(--expected-rentability-color);
      }
      .expected-rentability-total {
        color: var(--expected-rentability-total-color);
      }
    `;
    this.shadowRoot.appendChild(style);

    // Adicionar informações de investimento
    const content = this.shadowRoot.querySelector('.content');
    if (content) {
      content.innerHTML = `
        ${valueHTML}
        ${dateHTML}
        ${periodHTML}
        ${interestRateHTML}
        ${rentabilityHTML}
      `;
    }

    // Adicionar badges específicos de investimento
    const card = this.shadowRoot.querySelector('.card');
    const statusBadge = this.shadowRoot.querySelector('.badge');

    if (card) {
      card.className = `card ${status.className === 'status-finished' ? 'finished' : ''} ${status.className === 'status-active' ? 'active' : ''} ${status.className === 'status-future' ? 'future' : ''}`;
    }

    if (statusBadge) {
      statusBadge.className = `badge ${status.className}`;
      statusBadge.textContent = status.text;
    }
  }

  connectedCallback() {
    i18n.addObserver(this._i18nCallback);
  }

  disconnectedCallback() {
    i18n.removeObserver(this._i18nCallback);
  }
}

if (!customElements.get('investment-card')) {
  customElements.define('investment-card', InvestmentCard);
}

export default InvestmentCard;
