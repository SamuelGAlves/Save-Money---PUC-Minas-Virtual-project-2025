import {
  getShowValues,
  subscribeToVisibility,
  unsubscribeFromVisibility,
} from '../../store/visibilityStore.js';

import { formatCurrencyCode } from '../../utils/currency.js';
import { formatFullDate } from '../../utils/date.js';
import { i18n } from '../../i18n/i18n.js';

class BaseCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._i18nCallback = () => {
      if (this.isConnected) {
        this.render();
      }
    };
  }

  static get observedAttributes() {
    return ['title', 'value', 'date', 'status', 'type', 'isRecurring', 'recurrenceType', 'recurrenceCount', 'history', 'recurrences'];
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

  getStatus(date, status) {
    // Se já tiver um status definido, retorna ele
    if (status) {
      return { text: status, className: `status-${status.toLowerCase()}` };
    }

    // Se não tiver data, não retorna status
    if (!date) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const itemDate = new Date(date + 'T00:00:00');
    itemDate.setHours(0, 0, 0, 0);

    if (itemDate.getTime() === today.getTime()) {
      return { text: i18n.getTranslation('common.card.status.today'), className: 'status-today' };
    } else if (itemDate < today) {
      return { text: i18n.getTranslation('common.card.status.overdue'), className: 'status-overdue' };
    } else {
      const diffTime = Math.abs(itemDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        text: i18n.getTranslation('common.card.status.available', { days: diffDays }),
        className: 'status-available'
      };
    }
  }

  render() {
    const title = this.getAttribute('title') || i18n.getTranslation('common.card.title');
    const value = parseFloat(this.getAttribute('value')) || 0;
    const currencyType = this.getAttribute('currencyType') || 'BRL';
    const date = this.getAttribute('date');
    const status = this.getAttribute('status');
    const type = this.getAttribute('type') || 'default';
    const isRecurring = this.getAttribute('isRecurring') === 'true';
    const recurrenceType = this.getAttribute('recurrenceType');
    const recurrenceCount = parseInt(this.getAttribute('recurrenceCount')) || 0;
    const history = JSON.parse(this.getAttribute('history') || '[]');
    const recurrences = JSON.parse(this.getAttribute('recurrences') || '[]');

    const valueHTML = value
      ? `<p><strong><app-icon margin="0 .5rem 0 0">payments</app-icon> ${i18n.getTranslation('common.card.value')}:</strong> ${
          getShowValues() ? formatCurrencyCode(value, currencyType) : '••••••••'
        }</p>`
      : '';

    const dateHTML = date
      ? `<p><strong><app-icon margin="0 .5rem 0 0">today</app-icon> ${i18n.getTranslation('common.card.date')}:</strong> ${formatFullDate(
          new Date(date + 'T00:00:00')
        )}</p>`
      : '';

    const recurrenceHTML = isRecurring ? `
      <p><strong><app-icon margin="0 .5rem 0 0">repeat</app-icon> ${i18n.getTranslation('common.card.recurrence.title')}:</strong> ${
        recurrenceType === 'weekly' ? i18n.getTranslation('common.card.recurrence.weekly') :
        recurrenceType === 'monthly' ? i18n.getTranslation('common.card.recurrence.monthly') :
        i18n.getTranslation('common.card.recurrence.yearly')
      }</p>
      <p><strong><app-icon margin="0 .5rem 0 0">schedule</app-icon> ${i18n.getTranslation('common.card.recurrence.repetitions')}:</strong> ${
        recurrenceCount === 0
          ? i18n.getTranslation('common.card.recurrence.indefinite')
          : i18n.getTranslation('common.card.recurrence.times', { count: recurrenceCount })
      }</p>
    ` : '';

    const statusInfo = this.getStatus(date, status);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex: 1;
        }
        .card {
          display: flex;
          flex-direction: column;
          width: 100%;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
          background: var(--background-card-color);
          box-shadow: 0 2px 6px var(--shadow-color);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px var(--shadow-color);
        }
        h2 {
          margin: 0 0 0.5rem;
          font-size: 1.25rem;
          color: var(--text-color);
        }
        p {
          margin: 0.25rem 0;
          font-size: 0.95rem;
          color: var(--text-muted-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        strong {
          font-weight: bold;
          color: var(--text-color);
          display: flex;
          align-items: center;
          margin-right: 0.5rem;
        }
        .content {
          margin-bottom: 1rem;
        }
        .actions {
          margin-top: auto;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          width: 100%;
        }
        .actions app-button {
          flex: 1;
          min-width: 120px;
          max-width: 100%;
          flex-basis: fit-content;
        }
        .badge {
          position: absolute;
          top: -10px;
          left: 10px;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: bold;
          color: var(--badge-text-color, #fff);
        }
        .recurring-badge {
          position: absolute;
          top: -10px;
          right: 10px;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: bold;
          color: var(--background-color);
          background-color: var(--text-color);
          border: none;
        }
        @media (max-width: 600px) {
          .card {
            padding: 1rem;
          }
          .actions {
            flex-direction: column;
          }
          .actions app-button {
            width: 100%;
            min-width: 100%;
          }
          h2 {
            font-size: 1.1rem;
            margin-right: 2rem;
          }
          p {
            font-size: 0.9rem;
          }
        }
      </style>
      <div class="card">
        ${statusInfo ? `<span class="badge ${statusInfo.className}">${statusInfo.text}</span>` : ''}
        ${isRecurring ? `<span class="recurring-badge">${i18n.getTranslation('common.card.recurrence.badge')}</span>` : ''}
        <h2>${title}</h2>
        <div class="content">
          ${valueHTML}
          ${dateHTML}
          ${recurrenceHTML}
        </div>
        <div class="actions">
          <app-button data-action="delete" variant="ghost" fullWidth="true">
            <app-icon size="small">delete</app-icon>${i18n.getTranslation('common.card.actions.delete')}
          </app-button>
          <app-button data-action="edit" variant="ghost" fullWidth="true">
            <app-icon size="small">edit</app-icon>${i18n.getTranslation('common.card.actions.edit')}
          </app-button>
          <app-button data-action="history" variant="ghost" fullWidth="true">
            <app-icon size="small">history</app-icon>${i18n.getTranslation('common.card.actions.history')}
          </app-button>
          ${isRecurring ? `
            <app-button data-action="recurring" variant="ghost" fullWidth="true">
              <app-icon size="small">repeat</app-icon>${i18n.getTranslation('common.card.actions.recurring')}
            </app-button>
          ` : ''}
        </div>
      </div>
    `;

    // Adicionar eventos
    this.shadowRoot.querySelectorAll('app-button').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        const id = this.getAttribute('id');

        this.dispatchEvent(new CustomEvent(action, {
          detail: { id },
          bubbles: true,
          composed: true
        }));
      });
    });
  }
}

if (!customElements.get('base-card')) {
  customElements.define('base-card', BaseCard);
}

export default BaseCard;
