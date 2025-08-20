import ModalBase from "./modal.js";
import { formatFullDate } from "../../utils/date.js";
import { i18n } from "../../i18n/i18n.js";

class HistoryModal extends ModalBase {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this._i18nUnsubscribe = i18n.addObserver(() => {
      this.render();
    });
  }

  disconnectedCallback() {
    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
  }

  open(item) {
    this.item = item;
    super.open();

    const historyList = this.shadowRoot.querySelector('#history-list');
    if (historyList) {
      historyList.innerHTML = this.generateHistoryHTML(item);
    }
  }

  formatChange(field, change) {
    // Se for uma criação, retorna o valor formatado
    if (change.value !== undefined) {
      return `${change.field}: ${change.value}`;
    }

    // Se for uma atualização, formata a mudança
    const formatValue = (value) => {
      if (value === null || value === undefined || value === '') {
        return i18n.getTranslation('history.notDefined');
      }
      return value;
    };

    switch (field) {
      case 'value':
        return `${change.field}: ${formatValue(change.from)} → ${formatValue(change.to)}`;
      case 'date':
      case 'period':
        // Não mostrar alterações de data de fim se ambas forem não definidas
        if (field === 'period' && !change.from && !change.to) {
          return null;
        }
        return `${change.field}: ${formatValue(change.from)} → ${formatValue(change.to)}`;
      case 'interestRate':
        return `${change.field}: ${formatValue(change.from)} → ${formatValue(change.to)}`;
      case 'interestType':
        return `${change.field}: ${formatValue(change.from)} → ${formatValue(change.to)}`;
      case 'received':
        return `${change.field}: ${change.from} → ${change.to}`;
      case 'paid':
        return `${change.field}: ${change.from} → ${change.to}`;
      case 'isRecurring':
        return `${change.field}: ${change.from} → ${change.to}`;
      case 'recurrenceType':
        return `${change.field}: ${formatValue(change.from)} → ${formatValue(change.to)}`;
      case 'recurrenceCount':
        const formatRecurrenceCount = (count) => {
          if (count === undefined || count === null) return i18n.getTranslation('history.notDefined');
          if (count === 0) return i18n.getTranslation('history.indefinite');
          const num = typeof count === 'string' ? parseInt(count) : count;
          return num === 1 ? i18n.getTranslation('history.oneRepetition') : i18n.getTranslation('history.multipleRepetitions', { count: num });
        };
        return `${change.field}: ${formatRecurrenceCount(change.from)} → ${formatRecurrenceCount(change.to)}`;
      case 'recurrence':
        return `${change.field}: ${change.from} → ${change.to}\n${change.description}`;
      default:
        return `${change.field}: ${formatValue(change.from)} → ${formatValue(change.to)}`;
    }
  }

  generateHistoryHTML(item) {
    if (!item.history || item.history.length === 0) {
      return `
        <div class="empty-history">
          <app-icon size="large">history</app-icon>
          <p>${i18n.getTranslation('history.empty')}</p>
        </div>
      `;
    }

    // Ordenar histórico por timestamp (mais recente primeiro)
    const sortedHistory = [...item.history].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    return sortedHistory.map((entry) => {
      const date = new Date(entry.timestamp);
      const formattedDate = formatFullDate(date);
      const formattedTime = date.toLocaleTimeString('pt-BR');

      let changesHTML = '';
      if (entry.type === 'create') {
        changesHTML = `
          <div class="change-item">
            <app-icon class="change-icon">add_circle</app-icon>
            <span>${i18n.getTranslation('history.itemCreated')}</span>
          </div>
        `;
      } else {
        changesHTML = Object.entries(entry.changes)
          .map(([field, change]) => {
            const formattedChange = this.formatChange(field, change);
            if (!formattedChange) return ''; // Pula alterações que retornam null
            return `
              <div class="change-item">
                <app-icon class="change-icon" size="small">edit</app-icon>
                <span>${formattedChange}</span>
              </div>
            `;
          })
          .filter(html => html) // Remove strings vazias
          .join('');
      }

      return `
        <div class="history-item">
          <div class="history-date">
            <app-icon size="small">schedule</app-icon>
            ${formattedDate} ${formattedTime}
          </div>
          <div class="history-changes">
            ${changesHTML}
          </div>
        </div>
      `;
    }).join('');
  }

  render() {
    const history = this.item?.history || [];
    const createdAt = this.item?.createdAt;

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

        .history-list {
          flex: 1;
          max-height: calc(70vh - 150px);
          overflow-y: auto;
          position: relative;
          margin: 0.25rem 0;
          gap: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .history-item {
          position: relative;
          max-width: 320px;
        }

        .history-date {
          color: var(--text-muted-color);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .history-changes {
          color: var(--text-color);
          font-size: 0.85rem;
          background: var(--background-card-color);
          padding: 0.5rem;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .change-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 4px;
          background: var(--background-color);
          border: 1px solid var(--border-color);
          text-align: center;
        }

        .change-item .change-icon {
          flex-shrink: 0;
        }

        .change-item span {
          flex: 1;
        }

        .created-at {
          margin-bottom: 0.75rem;
          padding: 0.5rem;
          background: var(--status-received-color-light);
          border-radius: 6px;
          border: 1px solid var(--status-received-color);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          font-size: 0.85rem;
          margin-left: auto;
          margin-right: auto;
        }

        .button-group {
          display: flex;
          justify-content: center;
          margin-top: 0.75rem;
        }

        .button-group app-button {
          min-width: 120px;
        }

        .button-group app-button:active {
          transform: translateY(0);
          box-shadow: none;
        }

        .empty-history {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          color: var(--text-muted-color);
          text-align: center;
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
            <app-icon>history</app-icon>
            ${i18n.getTranslation('history.title')}
          </h2>

          ${createdAt ? `
            <div class="created-at">
              <app-icon>add_circle</app-icon>
              <strong>${i18n.getTranslation('history.createdAt')}:</strong> ${formatFullDate(new Date(createdAt))}
            </div>
          `
          : ''}

          <div class="history-list" id="history-list"></div>

          <div class="button-group">
            <app-button id="close" variant="primary">
              <app-icon size="small">done</app-icon>
              ${i18n.getTranslation('history.close')}
            </app-button>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('#close').onclick = () => this.close();
  }
}

if (!customElements.get('history-modal')) {
  customElements.define('history-modal', HistoryModal);
}

export default HistoryModal;
