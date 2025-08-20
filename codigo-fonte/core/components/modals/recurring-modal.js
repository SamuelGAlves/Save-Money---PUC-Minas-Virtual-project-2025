import ModalBase from "./modal.js";
import { formatFullDate } from "../../utils/date.js";
import { formatCurrencyCode } from "../../utils/currency.js";
import toast from "../../services/toast.js";

class RecurringModal extends ModalBase {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.item = { recurrences: [] }; // <-- Garante que item existe
    this.type = 'receita'; // valor padrão
    this.render();
  }

  open(item, type = 'receita') {



    this.item = {
      ...item,
      recurrences: item.recurrences || []
    };
    this.type = type; // 'receita' ou 'despesa'
    this.render();
    super.open();
  }

  updateProgress() {
    const progress = this.calculateProgress();
    const total = this.getTotalCount();
    const completed = this.getCompletedCount();
    const statusText = this.type === 'despesa' ? 'despesas pagas' : 'receitas recebidas';

    const progressFill = this.shadowRoot.querySelector('.progress-fill');
    const progressText = this.shadowRoot.querySelector('.progress-text');

    if (progressFill && progressText) {
      progressFill.style.width = `${progress}%`;
      progressFill.style.backgroundPosition = `${progress}% 0`;

      // Atualiza o box-shadow baseado no progresso
      let shadowColor;
      if (progress <= 25) {
        shadowColor = 'rgba(244, 67, 54, 0.4)'; // Vermelho
      } else if (progress <= 50) {
        shadowColor = 'rgba(255, 152, 0, 0.4)'; // Amarelo
      } else if (progress <= 75) {
        shadowColor = 'rgba(33, 150, 243, 0.4)'; // Azul
      } else {
        shadowColor = 'rgba(76, 175, 80, 0.4)'; // Verde
      }

      progressFill.style.boxShadow = `0 0 10px ${shadowColor}`;
      progressText.textContent = `${completed} de ${total} ${statusText} (${progress}%)`;
    }
  }

  updateRecurringItem(index, isReceived) {
    const item = this.shadowRoot.querySelector(`.recurring-item[data-index="${index}"]`);
    if (item) {
      const status = this.getDateStatus(this.item.recurrences[index]);
      item.className = `recurring-item ${status}`;

      const statusElement = item.querySelector('.recurring-status');
      if (statusElement) {
        statusElement.innerHTML = `
          <app-icon>${isReceived ? 'check_circle' : 'schedule'}</app-icon>
          ${isReceived ? this.statusText : this.pendingText}
        `;
      }
    }
  }

  getRecurringItemsHTML() {
    if (!this.item?.recurrences?.length) {

      return '<p>Nenhuma recorrência registrada.</p>';
    }

    const statusText = this.type === 'despesa' ? 'Pago' : 'Recebido';
    const pendingText = 'Pendente';
    const currencyType = this.item.currencyType || 'BRL';

    return this.item.recurrences.map((recurrence, index) => {
      const date = new Date(recurrence.date);
      const status = this.getDateStatus(recurrence);
      const isCompleted = recurrence[this.statusField];

      return `
        <div class="recurring-item ${status}" data-index="${index}">
          <div class="recurring-date">
            <app-icon>calendar_today</app-icon>
            ${formatFullDate(date)}
          </div>
          <div class="recurring-value">
            <app-icon>attach_money</app-icon>
            ${formatCurrencyCode(this.item.value, currencyType)}
          </div>
          <div class="recurring-status">
            <app-icon>${isCompleted ? 'check_circle' : 'schedule'}</app-icon>
            ${isCompleted ? statusText : pendingText}
          </div>
        </div>
      `;
    }).join('');
  }

  get statusField() {
    return this.type === 'despesa' ? 'paid' : 'received';
  }

  get statusText() {
    return this.type === 'despesa' ? 'Pago' : 'Recebido';
  }

  get pendingText() {
    return 'Pendente';
  }

  get statusTypeText() {
    return this.type === 'despesa' ? 'Pagamento' : 'Recebimento';
  }

  getDateStatus(recurrence) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(recurrence.date);
    date.setHours(0, 0, 0, 0);

    if (recurrence[this.statusField]) {
      return 'received';
    }
    if (date < today) return 'past';
    if (date.getTime() === today.getTime()) return 'today';
    return 'future';
  }

  calculateProgress() {
    if (!this.item?.recurrences?.length) return 0;
    const total = this.getTotalCount();
    const completed = this.getCompletedCount();
    return total > 0 ? (completed / total) * 100 : 0;
  }

  getTotalCount() {
    return this.item?.recurrences?.length || 0;
  }

  getCompletedCount() {
    if (!this.item?.recurrences?.length) return 0;
    return this.item.recurrences.filter(r => r[this.statusField]).length;
  }

  handleRecurrenceClick(event) {

    const { date, isReceived } = event.detail;


    // Atualizar o status da recorrência
    const recurrence = this.item.recurrences.find(r => r.date === date);
    if (recurrence) {


      // Remover o campo incorreto e adicionar o correto
      const otherField = this.type === 'despesa' ? 'received' : 'paid';
      delete recurrence[otherField];
      recurrence[this.statusField] = isReceived;

      const fromStatus = isReceived ? 'Não Pago' : 'Pago';
      const toStatus = isReceived ? 'Pago' : 'Não Pago';

      // Criar entrada no histórico
      const historyEntry = {
        timestamp: new Date().toISOString(),
        type: 'update',
        changes: {
          recurrence: {
            field: 'Status',
            from: fromStatus,
            to: toStatus,
            date: formatFullDate(new Date(date + 'T00:00:00')),
            description: `Recorrência de ${formatFullDate(new Date(date + 'T00:00:00'))} no valor de ${formatCurrencyCode(this.item.value, this.item.currencyType || 'BRL')}`
          }
        }
      };



      // Adicionar ao histórico
      this.item.history = [...(this.item.history || []), historyEntry];


      // Disparar evento para atualizar o card
      const eventName = this.type === 'despesa' ? 'mark-recurring-paid' : 'mark-recurring-received';
      const customEvent = new CustomEvent(eventName, {
        detail: {
          id: this.item.id,
          date,
          [this.type === 'despesa' ? 'isPaid' : 'isReceived']: isReceived,
          history: this.item.history,
          recurrences: this.item.recurrences
        },
        bubbles: true,
        composed: true
      });

      // Disparar o evento no documento para garantir que seja capturado
      document.dispatchEvent(customEvent);


      // Mostrar toast de confirmação
      const successMessage = this.type === 'despesa'
        ? (isReceived ? 'Recorrência marcada como paga!' : 'Recorrência desmarcada como paga!')
        : (isReceived ? 'Recorrência marcada como recebida!' : 'Recorrência desmarcada como recebida!');
      toast.success(successMessage);

      // Atualizar a interface
      this.updateProgress();
      this.updateRecurringItem(this.item.recurrences.indexOf(recurrence), isReceived);

    } else {
      console.error('Recorrência não encontrada para a data:', date);
    }
  }

  get totalColor() {
    return this.type === 'despesa' ? 'var(--despesa-status-overdue-color)' : 'var(--receita-status-received-color)';
  }

  get estimatedColor() {
    return this.type === 'despesa' ? 'var(--despesa-status-today-color)' : 'var(--receita-status-today-color)';
  }

  get totalIcon() {
    return this.type === 'despesa' ? 'payments' : 'account_balance_wallet';
  }

  get estimatedIcon() {
    return this.type === 'despesa' ? 'analytics' : 'trending_up';
  }

  render() {
    const progress = this.calculateProgress();
    const total = this.getTotalCount();
    const completed = this.getCompletedCount();
    const statusText = this.type === 'despesa' ? 'despesas pagas' : 'receitas recebidas';

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
          padding: 2rem;
          margin: 1rem;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.3s ease;
        }

        .recurring-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-shrink: 0;
        }

        .recurring-title {
          font-size: 1.2em;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-color);
        }

        .recurring-title i {
          color: var(--color-primary);
        }

        .recurring-close {
          background: none;
          border: none;
          font-size: 1.2em;
          cursor: pointer;
          color: var(--text-muted-color);
          padding: 5px;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .recurring-close:hover {
          background-color: var(--color-gray-light);
        }

        .recurring-progress {
          margin-bottom: 20px;
          flex-shrink: 0;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: var(--color-gray-light);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          border: 4px solid var(--progress-border-color);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--despesa-status-overdue-color) 0%,
            var(--despesa-status-today-color) 33%,
            var(--despesa-status-future-color) 66%,
            var(--despesa-status-paid-color) 100%
          );
          background-size: 400% 100%;
          transition: width 0.3s ease, background-position 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4);
          }
          25% {
            box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.4);
          }
          50% {
            box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
          }
          75% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4);
          }
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 100%
          );
          animation: shine 2s infinite;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .progress-text {
          text-align: center;
          margin-top: 5px;
          color: var(--text-muted-color);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .progress-text i {
          color: var(--color-primary);
        }

        .recurring-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          max-height: calc(80vh - 250px);
          padding-right: 10px;
        }

        .recurring-items::-webkit-scrollbar {
          width: 8px;
        }

        .recurring-items::-webkit-scrollbar-track {
          background: var(--color-gray-light);
          border-radius: 4px;
        }

        .recurring-items::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          border-radius: 4px;
        }

        .recurring-items::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary-dark);
        }

        .recurring-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-radius: 4px;
          background: var(--color-gray-light);
          cursor: pointer;
          transition: background-color 0.2s;
          color: var(--text-color);
        }

        .recurring-item:hover {
          background: var(--background-color);
        }

        .recurring-item.received {
          background: var(--despesa-status-paid-color-light);
        }

        .recurring-item.past {
          background: var(--despesa-status-overdue-color-light);
        }

        .recurring-item.today {
          background: var(--despesa-status-today-color-light);
        }

        .recurring-date, .recurring-value, .recurring-status {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .recurring-status i {
          color: var(--despesa-status-paid-color);
        }

        .recurring-item.past .recurring-status i {
          color: var(--despesa-status-overdue-color);
        }

        .recurring-item.today .recurring-status i {
          color: var(--despesa-status-today-color);
        }

        .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
          flex-shrink: 0;
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
      </style>

      <div id="modal" role="dialog" aria-labelledby="modal-title">
        <div class="modal-content">
          <div class="recurring-header">
            <div class="recurring-title">
              <app-icon>repeat</app-icon>
              Recorrências
            </div>
          </div>
          <div class="recurring-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%; background-position: ${progress}% 0"></div>
            </div>
            <div class="progress-text">
              ${progress === 100 ?
                `<app-icon>task_alt</app-icon>` :
                `<app-icon>analytics</app-icon>`}
              ${completed} de ${total} ${statusText} (${progress}%)
            </div>
          </div>
          <div class="recurring-items"></div>
          <div class="button-group">
            <app-button id="close" variant="primary">
              <app-icon size="small">check</app-icon>
              Ok, Entendi
            </app-button>
          </div>
        </div>
      </div>
    `;

    const closeButton = this.shadowRoot.querySelector('#close');
    closeButton?.addEventListener('click', () => this.close());

    // Otimização: renderiza recorrências via DocumentFragment
    const itemsContainer = this.shadowRoot.querySelector('.recurring-items');
    const fragment = document.createDocumentFragment();
    const currencyType = (this.item && this.item.currencyType) ? this.item.currencyType : 'BRL';

    if (!this.item?.recurrences?.length) {
      itemsContainer.innerHTML = '<p>Nenhuma recorrência registrada.</p>';
    } else {
      this.item.recurrences.forEach((recurrence, index) => {
        const date = new Date(recurrence.date);
        const status = this.getDateStatus(recurrence);
        const isCompleted = recurrence[this.statusField];

        const div = document.createElement('div');
        div.className = `recurring-item ${status}`;
        div.dataset.index = index;
        div.innerHTML = `
          <div class="recurring-date">
            <app-icon>calendar_today</app-icon>
            ${formatFullDate(date)}
          </div>
          <div class="recurring-value">
            <app-icon>attach_money</app-icon>
            ${formatCurrencyCode(this.item.value, currencyType)}
          </div>
          <div class="recurring-status">
            <app-icon>${isCompleted ? 'check_circle' : 'schedule'}</app-icon>
            ${isCompleted ? this.statusText : this.pendingText}
          </div>
        `;
        fragment.appendChild(div);
      });
      itemsContainer.appendChild(fragment);

      // Delegação de eventos para recorrências
      itemsContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.recurring-item');
        if (item) {
          const index = parseInt(item.dataset.index);
          const recurrence = this.item.recurrences[index];
          const isReceived = !recurrence[this.statusField];
          const detail = { date: recurrence.date, isReceived };
          this.handleRecurrenceClick({ detail });
        }
      });
    }
  }
}

if (!customElements.get('recurring-modal')) {
  customElements.define('recurring-modal', RecurringModal);
}

export default RecurringModal;

