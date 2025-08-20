import ModalBase from "../../../components/modals/modal.js";
import { i18n } from "../../../i18n/i18n.js";

class ReceitaModal extends ModalBase {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  open(receita = {}) {
    super.open();



    // Preencher o campo "Data Início" com a data de hoje
    const today = new Date().toISOString().split('T')[0];

    // Limpa o estado anterior
    this.setInputValue('#title', '');
    this.setInputValue('#value', '');
    this.setInputValue('#date', '');
    this.setInputValue('#period', '');

    // Define os novos valores
    this.setInputValue('#title', receita.title || '');
    this.setInputValue('#value', receita.value || '', receita.currencyType);

    // AJUSTE: setar o tipo de moeda no input de valor
    const valueInput = this.shadowRoot.querySelector('#value');
    if (valueInput) {
      // Se tiver currencyType no item, usa ele, senão usa o i18n
      valueInput.currencyType = receita.currencyType || i18n.getTranslation('common.currency');
    }

    this.setInputValue('#date', receita.date || today);
    this.setInputValue('#period', receita.period || '');
    this.received = receita.received || false;

    // Preencher campos de recorrência
    const isRecurringCheckbox = this.shadowRoot.querySelector('#isRecurring');
    const recurringOptions = this.shadowRoot.querySelector('#recurringOptions');
    const recurrenceTypeSelect = this.shadowRoot.querySelector('#recurrenceType');
    const recurrenceCountInput = this.shadowRoot.querySelector('#recurrenceCount');
    const receivedCheckbox = this.shadowRoot.querySelector('#received');

    isRecurringCheckbox.checked = receita.isRecurring || false;
    recurringOptions.classList.toggle('hidden', !isRecurringCheckbox.checked);

    if (receita.recurrenceType) {
      recurrenceTypeSelect.value = receita.recurrenceType;
    }

    if (receita.recurrenceCount !== undefined) {
      recurrenceCountInput.value = receita.recurrenceCount;
    }

    if (receivedCheckbox) {
      receivedCheckbox.checked = this.received;
      // Garante estado correto ao abrir
      if (isRecurringCheckbox.checked) {
        receivedCheckbox.checked = false;
        receivedCheckbox.disabled = true;
        receivedCheckbox.classList.add('hidden');
      } else {
        receivedCheckbox.disabled = false;
        receivedCheckbox.classList.remove('hidden');
      }
    }

    // Atualiza a visibilidade do checkbox ao abrir o modal
    receivedCheckbox.classList.toggle('hidden', isRecurringCheckbox.checked);

    this.editingId = receita.id; // Usar o id único para edição

    const titleElement = this.shadowRoot.querySelector('h2');
    titleElement.textContent = receita.id ? 'Editar Receita' : 'Nova Receita';

    // Limpar qualquer estado de erro anterior
    this.clearErrors();
  }

  getInputValue(selector, raw = false) {
    const inputComponent = this.shadowRoot.querySelector(selector);

    if (inputComponent) {
      // Retorna o valor bruto (raw) formatado com duas casas decimais ou o valor formatado
      if (raw) {
        const rawValue = parseFloat(inputComponent.rawValue || 0);
        return rawValue.toFixed(2); // Garante duas casas decimais
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
    const date = this.getInputValue('#date');
    const period = this.getInputValue('#period');
    const isRecurring = this.shadowRoot.querySelector('#isRecurring').checked;
    const recurrenceCount = parseInt(this.getInputValue('#recurrenceCount')) || 0;

    let isValid = true;

    // Validação do título
    if (!title) {
      this.setError('#title', 'O título é obrigatório.');
      isValid = false;
    }

    // Validação do valor
    if (!value || parseFloat(value) <= 0) {
      this.setError('#value', 'O valor deve ser maior que R$ 0,00.');
      isValid = false;
    }

    // Validação da data de início
    if (!date) {
      this.setError('#date', 'A data de início é obrigatória.');
      isValid = false;
    }

    // Validação da data de fim
    if (date && period && new Date(date) > new Date(period)) {
      this.setError('#period', 'A data de fim deve ser posterior à data de início.');
      isValid = false;
    }

    // Validação da recorrência
    if (isRecurring) {
      if (recurrenceCount < 2) {
        this.setError('#recurrenceCount', 'O número de repetições deve ser pelo menos 2.');
        isValid = false;
      } else if (recurrenceCount > 365) {
        this.setError('#recurrenceCount', 'O número máximo de repetições é 365.');
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
    ['#title', '#value', '#date', '#period'].forEach((selector) => {
      this.removeError(selector);
    });
  }

  handleInputChange() {
    if (this.getInputValue('#title')) this.removeError('#title');
    if (this.getInputValue('#value', true)) this.removeError('#value');
    if (this.getInputValue('#date')) this.removeError('#date');
    if (this.getInputValue('#period')) this.removeError('#period');

    const isRecurring = this.shadowRoot.querySelector('#isRecurring').checked;
    const recurrenceCount = parseInt(this.shadowRoot.querySelector('#recurrenceCount').value) || 0;

    if (isRecurring && recurrenceCount >= 2) {
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

        .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
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
          <h2>Receita</h2>
          <form id="receita-form">
            <app-input id="title" label="Título:" maxlength="20" minlength="3"></app-input>
            <app-input id="value" label="Valor:" type="currency" inputmode="numeric"></app-input>
            <app-input id="date" label="Data Início:" type="date"></app-input>
            <app-input id="period" label="Data Fim (opcional):" type="date"></app-input>

            <app-checkbox id="isRecurring" label="Recorrente"></app-checkbox>

            <div id="recurringOptions" class="hidden">
              <app-select
                id="recurrenceType"
                label="Tipo de Recorrência:"
                options='[
                  {"value":"daily","label":"Diária"},
                  {"value":"weekly","label":"Semanal"},
                  {"value":"monthly","label":"Mensal"},
                  {"value":"yearly","label":"Anual"}
                ]'>
              </app-select>
              <app-input
                id="recurrenceCount"
                label="Repetições:"
                type="number"
                min="1"
                max="365"
                value="1"
                tip="Mínimo 1 e máximo 365"
              ></app-input>
            </div>

            <app-checkbox id="received" label="Marcar como recebido" ${this.received ? 'checked' : ''}></app-checkbox>

            <div class="button-group">
              <app-button id="cancel" variant="danger"><app-icon>close</app-icon>Cancelar</app-button>
              <app-button id="save"><app-icon>check</app-icon>Salvar</app-button>
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
        currencyType, // Salva o tipo da moeda junto
        date: this.getInputValue('#date'),
        period: this.getInputValue('#period'),
        received: this.shadowRoot.querySelector('#received').checked,
        isRecurring: this.shadowRoot.querySelector('#isRecurring').checked,
        recurrenceType: this.shadowRoot.querySelector('#recurrenceType').value,
        recurrenceCount: parseInt(this.shadowRoot.querySelector('#recurrenceCount').value) || 0
      };

      this.dispatchEvent(new CustomEvent('save-receita', { detail }));
      this.close();
    };

    // Atualizar o campo "Data Fim" com base na "Data Início"
    const startDateInput = this.shadowRoot.querySelector('#date');
    const endDateInput = this.shadowRoot.querySelector('#period');

    startDateInput.addEventListener('input', () => {
      const startDate = startDateInput.value;
      if (startDate) {
        endDateInput.setAttribute('min', startDate);
      }
    });

    // Escutando os inputs para remover erros
    ['#title', '#value', '#date'].forEach((selector) => {
      const inputWrapper = this.shadowRoot.querySelector(selector);
      inputWrapper?.addEventListener('input', () => this.handleInputChange());
    });

    // Adicionar evento para mostrar/ocultar opções de recorrência
    const isRecurringCheckbox = this.shadowRoot.querySelector('#isRecurring');
    const recurringOptions = this.shadowRoot.querySelector('#recurringOptions');
    const recurrenceCountInput = this.shadowRoot.querySelector('#recurrenceCount');
    const receivedCheckbox = this.shadowRoot.querySelector('#received');

    isRecurringCheckbox.addEventListener('change', () => {
      recurringOptions.classList.toggle('hidden', !isRecurringCheckbox.checked);
      if (isRecurringCheckbox.checked) {
        receivedCheckbox.checked = false;
        receivedCheckbox.disabled = true;
        receivedCheckbox.classList.add('hidden');
      } else {
        receivedCheckbox.disabled = false;
        receivedCheckbox.classList.remove('hidden');
      }
    });

    // Controle de visibilidade do checkbox "Marcar como recebido"
    const updateReceivedVisibility = () => {
      receivedCheckbox.classList.toggle('hidden', isRecurringCheckbox.checked);
    };

    // Inicializa visibilidade correta ao abrir o modal
    updateReceivedVisibility();

    // Adicionar evento para limitar o número de recorrências
    recurrenceCountInput.addEventListener('input', (event) => {
      const value = parseInt(event.target.value) || 0;
      if (value > 365) {
        event.target.value = 365;
        this.setError('#recurrenceCount', 'Valor máximo permitido: 365');
      } else {
        this.removeError('#recurrenceCount');
      }
    });
  }

  close() {
    super.close();
    // Limpa o estado do modal
    this.editingId = null;
    this.received = false;

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
    const receivedCheckbox = this.shadowRoot.querySelector('#received');

    if (isRecurringCheckbox) isRecurringCheckbox.checked = false;
    if (recurringOptions) recurringOptions.classList.add('hidden');
    if (receivedCheckbox) {
      receivedCheckbox.checked = false;
      receivedCheckbox.disabled = false;
      receivedCheckbox.classList.remove('hidden');
    }

    // Limpa os erros
    this.clearErrors();
  }
}

if (!customElements.get('receita-modal')) {
  customElements.define('receita-modal', ReceitaModal);
}

export default ReceitaModal;
