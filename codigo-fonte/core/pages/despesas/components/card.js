import {
  subscribeToVisibility,
  unsubscribeFromVisibility,
} from '../../../store/visibilityStore.js';

import BaseCard from '../../../components/cards/base-card.js';
import { i18n } from '../../../i18n/i18n.js';


class DespesaCard extends BaseCard {
  constructor() {
    super();
    this._i18nCallback = () => {
      this.render();
    };
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'paid', 'dueDate'];
  }

  connectedCallback() {
    this.updateVisibility = () => this.render();
    subscribeToVisibility(this.updateVisibility);
    i18n.addObserver(this._i18nCallback);
  }

  disconnectedCallback() {
    unsubscribeFromVisibility(this.updateVisibility);
    i18n.removeObserver(this._i18nCallback);
  }

  attributeChangedCallback() {
    this.render();
  }

  getStatus(dueDate, paid) {
    if (paid) {
      return { text: i18n.getTranslation('expenses.card.status.paid'), className: 'status-paid' };
    }

    if (!dueDate) {
      return { text: i18n.getTranslation('expenses.card.status.no-due-date'), className: 'status-future' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate + 'T00:00:00');
    due.setHours(0, 0, 0, 0);

    // Atrasado
    if (today > due) {
      return { text: i18n.getTranslation('expenses.card.status.overdue'), className: 'status-overdue' };
    }

    // Vence hoje
    if (today.getTime() === due.getTime()) {
      return { text: i18n.getTranslation('expenses.card.status.today'), className: 'status-today' };
    }

    // Disponível no futuro
    if (today < due) {
      const diffDays = Math.ceil((due - today) / (1000 * 3600 * 24));
      return {
        text: diffDays === 1
          ? i18n.getTranslation('expenses.card.status.tomorrow')
          : i18n.getTranslation('expenses.card.status.future', { days: diffDays }),
        className: 'status-future',
      };
    }

    // Fallback
    return { text: i18n.getTranslation('expenses.card.status.no-due-date'), className: 'status-future' };
  }

  render() {
    const paid = this.getAttribute('paid') === 'true';
    const dueDate = this.getAttribute('dueDate');
    const isRecurring = this.getAttribute('isRecurring') === 'true';
    const recurrences = JSON.parse(this.getAttribute('recurrences') || '[]');

    // Verificar se todas as recorrências estão pagas
    const isComplete = isRecurring && recurrences.length > 0 && recurrences.every(r => r.paid);



    // Determinar o status
    let status;
    if (isComplete) {
      status = { text: i18n.getTranslation('expenses.card.status.complete'), className: 'status-complete' };
    } else if (paid) {
      status = { text: i18n.getTranslation('expenses.card.status.paid'), className: 'status-paid' };
    } else {
      status = this.getStatus(dueDate, paid);
    }

    // Adicionar classes específicas de despesa
    const cardClasses = [
      paid ? 'paid' : '',
      isComplete ? 'complete' : '',
      !paid && !isComplete ? (status.className === 'status-overdue' ? 'overdue' : '') : '',
      !paid && !isComplete ? (status.className === 'status-today' ? 'today' : '') : '',
      !paid && !isComplete ? (status.className === 'status-future' ? 'future' : '') : ''
    ].filter(Boolean).join(' ');

    // Chamar o render do pai
    super.render();

    // Adicionar estilos específicos de despesa
    const style = document.createElement('style');
    style.textContent = `
      .card.paid {
        background-color: var(--status-received-color-light);
        border: 2px solid var(--status-received-color);
      }
      .card.complete {
        background-color: var(--despesa-status-paid-color-light);
        border: 2px solid var(--despesa-status-paid-color);
      }
      .card.overdue {
        background-color: var(--despesa-status-overdue-color-light);
        border: 2px solid var(--despesa-status-overdue-color);
      }
      .card.today {
        background-color: var(--despesa-status-today-color-light);
        border: 2px solid var(--despesa-status-today-color);
      }
      .card.future {
        background-color: var(--despesa-status-future-color-light);
        border: 2px solid var(--despesa-status-future-color);
      }
      .status-paid {
        background-color: var(--despesa-status-paid-color);
      }
      .status-overdue {
        background-color: var(--despesa-status-overdue-color);
      }
      .status-today {
        background-color: var(--despesa-status-today-color);
      }
      .status-future {
        background-color: var(--despesa-status-future-color);
      }
      .status-complete {
        background-color: var(--despesa-status-paid-color);
      }

      .status-paid, .status-complete {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
      }
    `;
    this.shadowRoot.appendChild(style);

    // Adicionar botão de pagamento
    const actions = this.shadowRoot.querySelector('.actions');
    if (actions && !isRecurring) {
      const payButton = document.createElement('app-button');
      payButton.setAttribute('data-action', 'pay');
      payButton.setAttribute('variant', 'ghost');
      payButton.setAttribute('fullWidth', 'true');
      payButton.innerHTML = `<app-icon size="small">${paid ? 'money_off' : 'payments'}</app-icon>${paid ? i18n.getTranslation('common.actions.cancel') : i18n.getTranslation('common.actions.confirm')}`;
      actions.insertBefore(payButton, actions.firstChild);

      payButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('pay', {
          detail: { id: this.getAttribute('id') },
          bubbles: true,
          composed: true
        }));
      });
    }

    // Ocultar botão de editar se estiver pago ou pago completo
    const editButton = this.shadowRoot.querySelector('[data-action="edit"]');
    if (editButton && (paid || isComplete)) {
      editButton.style.display = 'none';
    }

    // Atualizar o card e o badge
    const card = this.shadowRoot.querySelector('.card');
    const statusBadge = this.shadowRoot.querySelector('.badge');

    if (card) {
      card.className = `card ${cardClasses}`;
    }

    if (statusBadge) {
      statusBadge.className = `badge ${status.className}`;
      statusBadge.textContent = status.text;
    }
  }
}

if (!customElements.get('despesa-card')) {
  customElements.define('despesa-card', DespesaCard);
}

export default DespesaCard;
