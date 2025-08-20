import { formatFullDate } from '../../../utils/date.js';
import BaseCard from '../../../components/cards/base-card.js';
import { i18n } from '../../../i18n/i18n.js';

class ReceitaCard extends BaseCard {
  constructor() {
    super();
    this._i18nCallback = () => {
      this.render();
    };
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'received', 'period'];
  }

  getStatus(date, received) {
    if (received) {
      return { text: i18n.getTranslation('income.card.status.received'), className: 'status-received' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const receitaDate = new Date(date + 'T00:00:00');
    receitaDate.setHours(0, 0, 0, 0);

    // Primeiro dia do mês atual
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // Primeiro dia do próximo mês
    const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    if (receitaDate.getTime() === today.getTime()) {
      return { text: i18n.getTranslation('income.card.status.today'), className: 'status-today' };
    } else if (receitaDate < today) {
      return { text: i18n.getTranslation('income.card.status.last-day'), className: 'status-received-await' };
    } else if (receitaDate >= firstDayOfMonth && receitaDate < firstDayOfNextMonth) {
      return { text: i18n.getTranslation('income.card.status.available'), className: 'status-this-month' };
    } else {
      const diffTime = Math.abs(receitaDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { text: i18n.getTranslation('income.card.status.available'), className: 'status-available' };
    }
  }

  render() {
    const received = this.getAttribute('received') === 'true';
    const date = this.getAttribute('date');
    const period = this.getAttribute('period');
    const isRecurring = this.getAttribute('isRecurring') === 'true';
    const recurrences = JSON.parse(this.getAttribute('recurrences') || '[]');

    // Verificar se todas as recorrências estão recebidas
    const isComplete = isRecurring && recurrences.length > 0 && recurrences.every(r => r.received);

    // Determinar o status
    const status = this.getStatus(date, received);

    // Adicionar classes específicas de receita
    const cardClasses = [
      received ? 'received' : '',
      isComplete ? 'complete' : '',
      !received && !isComplete ? (status.className === 'status-overdue' ? 'overdue' : '') : '',
      !received && !isComplete ? (status.className === 'status-today' ? 'today' : '') : ''
    ].filter(Boolean).join(' ');

    // Chamar o render do pai
    super.render();

    // Adicionar estilos específicos de receita
    const style = document.createElement('style');
    style.textContent = `
      .card.received {
        background-color: var(--status-received-color-light);
        border: 2px solid var(--status-received-color);
      }
      .card.complete {
        background-color: var(--status-received-color-light);
        border: 2px solid var(--status-received-color);
      }
      .card.overdue {
        background-color: var(--status-overdue-color-light);
        border: 2px solid var(--status-overdue-color);
      }
      .card.today {
        background-color: var(--status-today-color-light);
        border: 2px solid var(--status-today-color);
      }
      .status-received {
        background-color: var(--status-received-color);
      }
      .status-received-await {
        background-color: var(--status-received-await-color);
      }
      .status-today {
        background-color: var(--status-today-color);
      }
      .status-this-month {
        background-color: var(--status-this-month-color);
      }
      .status-available {
        background-color: var(--status-available-color);
      }

      .status-received {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
      }

      .badge.complete {
        background-color: var(--status-received-color);
      }
    `;
    this.shadowRoot.appendChild(style);

    // Adicionar botão de recebimento
    const actions = this.shadowRoot.querySelector('.actions');
    if (actions && !isRecurring) {
      const receiveButton = document.createElement('app-button');
      receiveButton.setAttribute('data-action', 'mark-received');
      receiveButton.setAttribute('variant', 'ghost');
      receiveButton.setAttribute('fullWidth', 'true');
      receiveButton.innerHTML = `<app-icon size="small">${received ? 'money_off' : 'approval_delegation'}</app-icon>${received ? i18n.getTranslation('common.actions.cancel') : i18n.getTranslation('common.actions.confirm')}`;
      actions.insertBefore(receiveButton, actions.firstChild);

      receiveButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('mark-received', {
          detail: { id: this.getAttribute('id') },
          bubbles: true,
          composed: true
        }));
      });
    }

    // Ocultar botão de editar se estiver recebido ou recebido completo
    const editButton = this.shadowRoot.querySelector('[data-action="edit"]');
    if (editButton && (received || isComplete)) {
      editButton.style.display = 'none';
    }

    // Adicionar badges específicos de receita
    const card = this.shadowRoot.querySelector('.card');
    const statusBadge =  this.shadowRoot.querySelector('.badge');

    if (card) {
      card.className = `card ${cardClasses}`;
    } else {

    }

    if (statusBadge) {
      statusBadge.className = `badge ${status.className}${isComplete ? ' complete' : ''}`;
      statusBadge.textContent = isComplete ? i18n.getTranslation('income.card.status.complete') : status.text;
    }

    // Adicionar período se existir
    if (period) {
      const content = this.shadowRoot.querySelector('.content');
      if (content) {
        const periodElement = document.createElement('p');
        periodElement.innerHTML = `<strong><app-icon margin="0 .5rem 0 0">today</app-icon> ${i18n.getTranslation('income.form.period')}:</strong> ${formatFullDate(new Date(period + 'T00:00:00'))}`;
        content.appendChild(periodElement);
      }
    }
  }

  connectedCallback() {
    i18n.addObserver(this._i18nCallback);
  }

  disconnectedCallback() {
    i18n.removeObserver(this._i18nCallback);
  }
}

if (!customElements.get('receita-card')) {
  customElements.define('receita-card', ReceitaCard);
}

export default ReceitaCard;
