import ModalBase from "../../../components/modals/modal.js";
import { formatCurrencyCode } from "../../../utils/currency.js";
import { formatFullDate } from "../../../utils/date.js";
import { i18n } from "../../../i18n/i18n.js";

class DespesaModal extends ModalBase {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  open(despesa = {}) {
    super.open();


    // Preencher o campo "Data Início" com a data de hoje
    const today = new Date().toISOString().split('T')[0];

    // Limpa o estado anterior
    this.setInputValue('#title', '');
    this.setInputValue('#value', '');
    this.setInputValue('#date', '');
    this.setInputValue('#period', '');

    // Define os novos valores
    this.setInputValue('#title', despesa.title || '');
    this.setInputValue('#value', despesa.value || '', despesa.currencyType);

    // AJUSTE: setar o tipo de moeda no input de valor
    const valueInput = this.shadowRoot.querySelector('#value');
    if (valueInput) {
      valueInput.currencyType = despesa.currencyType || i18n.getTranslation('common.currency');
    }

    this.setInputValue('#date', despesa.date || today);
    this.paid = despesa.paid || false;

    // Preencher campos de recorrência
    const isRecurringCheckbox = this.shadowRoot.querySelector('#isRecurring');
    const recurringOptions = this.shadowRoot.querySelector('#recurringOptions');
    const recurrenceTypeSelect = this.shadowRoot.querySelector('#recurrenceType');
    const recurrenceCountInput = this.shadowRoot.querySelector('#recurrenceCount');
    const paidCheckbox = this.shadowRoot.querySelector('#paid');

    isRecurringCheckbox.checked = despesa.isRecurring || false;
    recurringOptions.classList.toggle('hidden', !isRecurringCheckbox.checked);

    if (despesa.recurrenceType) {
      recurrenceTypeSelect.value = despesa.recurrenceType;
    }

    if (despesa.recurrenceCount !== undefined) {
      recurrenceCountInput.value = despesa.recurrenceCount;
    }

    if (paidCheckbox) {
      paidCheckbox.checked = this.paid;
      if (isRecurringCheckbox.checked) {
        paidCheckbox.checked = false;
        paidCheckbox.disabled = true;
        paidCheckbox.classList.add('hidden');
      } else {
        paidCheckbox.disabled = false;
        paidCheckbox.classList.remove('hidden');
      }
    }

    // Atualiza a visibilidade do checkbox ao abrir o modal
    paidCheckbox.classList.toggle('hidden', isRecurringCheckbox.checked);

    this.editingId = despesa.id;
    const titleElement = this.shadowRoot.querySelector('h2');
    titleElement.textContent = despesa.id ? i18n.getTranslation('expenses.modal.edit') : i18n.getTranslation('expenses.modal.create');

    // Limpar qualquer estado de erro anterior
    this.clearErrors();
  }

  getInputValue(selector, raw = false) {
    const inputComponent = this.shadowRoot.querySelector(selector);
    if (inputComponent) {
      if (raw) {
        const rawValue = parseFloat(inputComponent.rawValue || 0);
        return rawValue.toFixed(2);
      }
      return inputComponent.value.trim();
    }
    return '';
  }

  setInputValue(selector, value, currencyType = null) {
    const inputComponent = this.shadowRoot.querySelector(selector);
    if (inputComponent) {
      inputComponent.value = value;

      // Se for um app-input de currency, trata o currency-type e o select
      if (inputComponent.getAttribute('type') === 'currency') {
        // Limpa o atributo para garantir que pegue do i18n por padrão
        inputComponent.removeAttribute('currency-type');
        // Se foi passado currencyType, seta explicitamente
        if (currencyType) {
          inputComponent.setAttribute('currency-type', currencyType);
        }
        // Força o select a mostrar o valor correto (do atributo ou do i18n)
        setTimeout(() => {
          const select = inputComponent.shadowRoot?.querySelector('.currency-select');
          if (select) {
            select.value = inputComponent.currencyType;
          }
        });
      }
    }
  }

  validateFields() {
    const title = this.getInputValue('#title');
    const value = this.getInputValue('#value', true);
    const dueDate = this.getInputValue('#date');
    const isRecurring = this.shadowRoot.querySelector('#isRecurring').checked;
    const recurrenceCount = parseInt(this.getInputValue('#recurrenceCount')) || 0;

    let isValid = true;

    if (!title) {
      this.setError('#title', i18n.getTranslation('expenses.validation.title'));
      isValid = false;
    }

    if (!value || parseFloat(value) <= 0) {
      this.setError('#value', i18n.getTranslation('expenses.validation.value'));
      isValid = false;
    }

    if (!dueDate) {
      this.setError('#date', i18n.getTranslation('expenses.validation.date'));
      isValid = false;
    }

    if (isRecurring) {
      if (recurrenceCount < 2) {
        this.setError('#recurrenceCount', i18n.getTranslation('expenses.validation.recurrence.min'));
        isValid = false;
      } else if (recurrenceCount > 365) {
        this.setError('#recurrenceCount', i18n.getTranslation('expenses.validation.recurrence.max'));
        isValid = false;
      }
    }

    return { isValid };
  }

  setError(selector, message) {
    const input = this.shadowRoot.querySelector(selector);
    if (input && typeof input.setError === 'function') {
      input.setError(message);
    }
  }

  removeError(selector) {
    const input = this.shadowRoot.querySelector(selector);
    if (input && typeof input.clearError === 'function') {
      input.clearError();
    }
  }

  clearErrors() {
    ['#title', '#value', '#date'].forEach((selector) => {
      this.removeError(selector);
    });
  }

  handleInputChange() {
    if (this.getInputValue('#title')) this.removeError('#title');
    if (this.getInputValue('#value', true)) this.removeError('#value');
    if (this.getInputValue('#date')) this.removeError('#date');

    const isRecurring = this.shadowRoot.querySelector('#isRecurring').checked;
    const recurrenceCount = parseInt(this.shadowRoot.querySelector('#recurrenceCount').value) || 0;

    if (isRecurring && recurrenceCount >= 1) {
      this.removeError('#recurrenceCount');
    }
  }

  render() {
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
          max-width: 400px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.3s ease;
        }

        h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          color: var(--color-text);
          text-align: center;
        }

        .hidden { display: none !important; }

        .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        #recurringOptions {
          display: flex;
          gap: 0.75rem;
          app-select,
          app-input {
            width: 50%;
          }
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
            margin: 2rem;
          }
        }
      </style>
      <div id="modal" role="dialog" aria-labelledby="modal-title">
        <div class="modal-content">
          <h2>${i18n.getTranslation('expenses.modal.title')}</h2>
          <form id="despesa-form">
            <app-input id="title" label="${i18n.getTranslation('expenses.form.title')}" maxlength="20" minlength="3"></app-input>
            <app-input id="value" label="${i18n.getTranslation('expenses.form.value')}" type="currency" inputmode="numeric"></app-input>
            <app-input id="date" label="${i18n.getTranslation('expenses.form.date')}" type="date"></app-input>
            <app-checkbox id="isRecurring" label="${i18n.getTranslation('expenses.form.recurring')}"></app-checkbox>

            <div id="recurringOptions" class="hidden">
              <app-select
                id="recurrenceType"
                label="${i18n.getTranslation('expenses.form.recurrence.type')}"
                options='[
                  {"value":"daily","label":"${i18n.getTranslation('expenses.form.recurrence.daily')}"},
                  {"value":"weekly","label":"${i18n.getTranslation('expenses.form.recurrence.weekly')}"},
                  {"value":"monthly","label":"${i18n.getTranslation('expenses.form.recurrence.monthly')}"},
                  {"value":"yearly","label":"${i18n.getTranslation('expenses.form.recurrence.yearly')}"}
                ]'>
              </app-select>
              <app-input
                id="recurrenceCount"
                label="${i18n.getTranslation('expenses.form.recurrence.count')}"
                type="number"
                min="1"
                max="365"
                value="1"
                tip="${i18n.getTranslation('expenses.form.recurrence.tip')}"
              ></app-input>
            </div>

            <app-checkbox id="paid" label="${i18n.getTranslation('expenses.form.paid')}" ${this.paid ? 'checked' : ''}></app-checkbox>

            <div class="button-group">
              <app-button id="cancel" variant="danger"><app-icon>close</app-icon>${i18n.getTranslation('common.buttons.cancel')}</app-button>
              <app-button id="save"><app-icon>check</app-icon>${i18n.getTranslation('common.buttons.save')}</app-button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('#cancel').onclick = () => this.close();
    this.shadowRoot.querySelector('#save').onclick = () => {
      const validation = this.validateFields();

      if (!validation.isValid) {
        return;
      }

      // Captura o tipo da moeda selecionado no app-input de valor
      const valueInput = this.shadowRoot.querySelector('#value');
      // O tipo da moeda está no atributo currency-type do app-input
      const currencyType = valueInput?.currencyType || valueInput?.getAttribute('currency-type') || 'BRL';

      const detail = {
        id: this.editingId || crypto.randomUUID(),
        title: this.getInputValue('#title'),
        value: this.getInputValue('#value', true),
        currencyType,
        dueDate: this.getInputValue('#date'),
        paid: this.shadowRoot.querySelector('#paid').checked,
        isRecurring: this.shadowRoot.querySelector('#isRecurring').checked,
        recurrenceType: this.shadowRoot.querySelector('#recurrenceType').value,
        recurrenceCount: parseInt(this.shadowRoot.querySelector('#recurrenceCount').value) || 0,
        createdAt: this.editingId ? undefined : new Date().toISOString(),
        history: this.editingId ? undefined : [{
          timestamp: new Date().toISOString(),
          type: 'create',
          changes: {
            title: { field: 'Título', value: this.getInputValue('#title') },
            value: { field: 'Valor', value: formatCurrencyCode(this.getInputValue('#value', true), currencyType) },
            dueDate: { field: 'Data de Vencimento', value: formatFullDate(new Date(this.getInputValue('#date'))) },
            paid: { field: 'Status de Pagamento', value: this.shadowRoot.querySelector('#paid').checked ? 'Pago' : 'Não Pago' },
            isRecurring: { field: 'Recorrência', value: this.shadowRoot.querySelector('#isRecurring').checked ? 'Sim' : 'Não' },
            recurrenceType: { field: 'Tipo de Recorrência', value: this.shadowRoot.querySelector('#recurrenceType').value },
            recurrenceCount: { field: 'Número de Repetições', value: this.shadowRoot.querySelector('#recurrenceCount').value }
          }
        }]
      };



      this.dispatchEvent(new CustomEvent('save-despesa', {
        detail,
        bubbles: true,
        composed: true
      }));
      this.close();
    };

    // Escutando os inputs para remover erros
    ['#title', '#value', '#date'].forEach((selector) => {
      const inputWrapper = this.shadowRoot.querySelector(selector);
      inputWrapper?.addEventListener('input', () => this.handleInputChange());
    });

    // Adicionar evento para mostrar/ocultar opções de recorrência
    const isRecurringCheckbox = this.shadowRoot.querySelector('#isRecurring');
    const recurringOptions = this.shadowRoot.querySelector('#recurringOptions');
    const paidCheckbox = this.shadowRoot.querySelector('#paid');

    isRecurringCheckbox.addEventListener('change', () => {
      recurringOptions.classList.toggle('hidden', !isRecurringCheckbox.checked);
      if (isRecurringCheckbox.checked) {
        paidCheckbox.checked = false;
        paidCheckbox.disabled = true;
        paidCheckbox.classList.add('hidden');
      } else {
        paidCheckbox.disabled = false;
        paidCheckbox.classList.remove('hidden');
      }
    });

    // Adicionar evento para limitar o número de recorrências
    const recurrenceCountInput = this.shadowRoot.querySelector('#recurrenceCount');
    recurrenceCountInput.addEventListener('input', (event) => {
      const value = parseInt(event.target.value) || 0;
      if (value > 365) {
        event.target.value = 365;
        this.setError('#recurrenceCount', 'Valor máximo permitido: 365');
      } else {
        this.removeError('#recurrenceCount');
      }
    });

    // Controle de visibilidade do checkbox "Marcar como pago"
    const updatePaidVisibility = () => {
      paidCheckbox.classList.toggle('hidden', isRecurringCheckbox.checked);
    };

    isRecurringCheckbox.addEventListener('change', () => {
      recurringOptions.classList.toggle('hidden', !isRecurringCheckbox.checked);
      if (isRecurringCheckbox.checked) {
        paidCheckbox.checked = false;
        paidCheckbox.disabled = true;
        paidCheckbox.classList.add('hidden');
      } else {
        paidCheckbox.disabled = false;
        paidCheckbox.classList.remove('hidden');
      }
      updatePaidVisibility();
    });

    // Inicializa visibilidade correta ao abrir o modal
    updatePaidVisibility();
  }

  close() {
    super.close();
    // Limpa o estado do modal
    this.editingId = null;
    this.paid = false;

    // Limpa os inputs
    this.setInputValue('#title', '');
    this.setInputValue('#value', '');
    this.setInputValue('#date', '');
    this.setInputValue('#period', '');

    // Reseta o currency-type para o i18n
    const valueInput = this.shadowRoot.querySelector('#value');
    if (valueInput) {
      valueInput.currencyType = i18n.getTranslation('common.currency');
    }

    // Reseta os checkboxes e selects
    const isRecurringCheckbox = this.shadowRoot.querySelector('#isRecurring');
    const recurringOptions = this.shadowRoot.querySelector('#recurringOptions');
    const paidCheckbox = this.shadowRoot.querySelector('#paid');

    if (isRecurringCheckbox) isRecurringCheckbox.checked = false;
    if (recurringOptions) recurringOptions.classList.add('hidden');
    if (paidCheckbox) {
      paidCheckbox.checked = false;
      paidCheckbox.disabled = false;
      paidCheckbox.classList.remove('hidden');
    }

    // Limpa os erros
    this.clearErrors();
  }
}

if (!customElements.get('despesa-modal')) {
  customElements.define('despesa-modal', DespesaModal);
}

export default DespesaModal;
