import ModalBase from "../../../components/modals/modal.js";
import { i18n } from "../../../i18n/i18n.js";

class InvestmentModal extends ModalBase {
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

  open(investment = {}) {
    super.open();

    // Preencher o campo "Data Início" com a data de hoje
    const today = new Date().toISOString().split('T')[0];

    // Limpa o estado anterior
    this.setInputValue('#title', '');
    this.setInputValue('#value', '');
    this.setInputValue('#start-date', '');
    this.setInputValue('#end-date', '');

    // Define os novos valores
    this.setInputValue('#title', investment.title || '');
    this.setInputValue('#value', investment.value ? investment.value.toFixed(2) : '', investment.currencyType);

    // AJUSTE: setar o tipo de moeda no input de valor
    const valueInput = this.shadowRoot.querySelector('#value');
    if (valueInput) {
      // Se tiver currencyType no item, usa ele, senão usa o i18n
      valueInput.currencyType = investment.currencyType || i18n.getTranslation('common.currency');
    }

    this.setInputValue('#start-date', investment.date || today);
    this.setInputValue('#end-date', investment.period || '');
    this.setInputValue('#interest-rate', investment.interestRate ? investment.interestRate.toFixed(2) : '0.50');
    this.shadowRoot.querySelector('#interest-type').value = investment.interestType || 'none';

    // Ocultar ou exibir o campo de taxa de juros com base no tipo de rentabilidade
    const interestRateWrapper = this.shadowRoot.querySelector('#interest-rate-wrapper');
    if (investment.interestType === 'none' || !investment.interestType) {
      interestRateWrapper.classList.add('hidden');
    } else {
      interestRateWrapper.classList.remove('hidden');
    }

    this.editingId = investment.id;

    const titleElement = this.shadowRoot.querySelector('h2');
    titleElement.textContent = investment.id ?
      i18n.getTranslation('investments.modal.edit') :
      i18n.getTranslation('investments.modal.create');

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

      if (inputComponent.getAttribute('type') === 'currency') {
        inputComponent.removeAttribute('currency-type');
        if (currencyType) {
          inputComponent.setAttribute('currency-type', currencyType);
        }
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
    const startDate = this.getInputValue('#start-date');
    const endDate = this.getInputValue('#end-date');
    const interestRate = this.getInputValue('#interest-rate', true);
    const interestType = this.shadowRoot.querySelector('#interest-type').value;

    let isValid = true;

    if (!title) {
      this.setError('#title', i18n.getTranslation('investments.validation.title'));
      isValid = false;
    }

    if (!value || parseFloat(value) <= 0) {
      this.setError('#value', i18n.getTranslation('investments.validation.value'));
      isValid = false;
    }

    if (!startDate) {
      this.setError('#start-date', i18n.getTranslation('investments.validation.startDate'));
      isValid = false;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      this.setError('#end-date', i18n.getTranslation('investments.validation.endDate'));
      isValid = false;
    }

    if (interestType !== 'none' && (!interestRate || parseFloat(interestRate) <= 0)) {
      this.setError('#interest-rate', i18n.getTranslation('investments.validation.interestRate'));
      isValid = false;
    }

    return { isValid };
  }

  setError(selector, message) {
    this.shadowRoot.querySelector(selector)?.setError(message);
  }

  removeError(selector) {
    this.shadowRoot.querySelector(selector)?.clearError();
  }

  clearErrors() {
    ['#title', '#value', '#start-date', '#end-date'].forEach((selector) => {
      this.removeError(selector);
    });
  }

  handleInputChange() {
    if (this.getInputValue('#title')) this.removeError('#title');
    if (this.getInputValue('#value', true)) this.removeError('#value');
    if (this.getInputValue('#start-date')) this.removeError('#start-date');
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

        label {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
          color: #333;
        }

        input, select {
          width: 100%;
          padding: 0.6rem;
          margin-top: 0.25rem;
          border: 2px solid var(--input-border-color);
          border-radius: 6px;
          font-size: 1rem;
          box-sizing: border-box;
          color: var(--input-text-color);
          background-color: var(--input-background-color);
        }

        input.error, select.error {
          border: 1px solid #e74c3c;
        }

        .error-message {
          color: #e74c3c;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        [for="interest-type"] {
          color: var(--color-text);
        }

        #interest-type {
          margin-bottom: 1rem;
        }

        .hidden {
          display: none !important;
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
          <h2 id="modal-title">${i18n.getTranslation('investments.modal.title')}</h2>
          <form id="investment-form">
            <app-input id="title" label="${i18n.getTranslation('investments.form.title')}" maxlength="20" minlength="3"></app-input>
            <app-input id="value" label="${i18n.getTranslation('investments.form.value')}" type="currency" inputmode="numeric"></app-input>
            <app-input id="start-date" label="${i18n.getTranslation('investments.form.startDate')}" type="date"></app-input>
            <app-input id="end-date" label="${i18n.getTranslation('investments.form.endDate')}" type="date"></app-input>

            <app-select
              id="interest-type"
              label="${i18n.getTranslation('investments.form.interestType')}"
              options='[
                {"value":"none","label":"${i18n.getTranslation('investments.form.interestTypes.none')}","selected":true},
                {"value":"month","label":"${i18n.getTranslation('investments.form.interestTypes.month')}"},
                {"value":"year","label":"${i18n.getTranslation('investments.form.interestTypes.year')}"}
              ]'>
            </app-select>

            <div id="interest-rate-wrapper" class="hidden">
              <app-input id="interest-rate" label="${i18n.getTranslation('investments.form.interestRate')}" type="percentage" value="0.5"></app-input>
            </div>

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

      const valueInput = this.shadowRoot.querySelector('#value');
      const currencyType = valueInput?.currencyType || valueInput?.getAttribute('currency-type') || 'BRL';

      const detail = {
        id: this.editingId || crypto.randomUUID(),
        title: this.getInputValue('#title'),
        value: this.getInputValue('#value', true),
        currencyType,
        date: this.getInputValue('#start-date'),
        period: this.getInputValue('#end-date'),
        interestRate: this.getInputValue('#interest-rate', true) || 0,
        interestType: this.shadowRoot.querySelector('#interest-type').value,
      };

      if (detail.interestType === 'none') {
        detail.interestRate = 0;
      }

      this.dispatchEvent(new CustomEvent('save-investment', { detail }));
      this.close();
    };

    const startDateInput = this.shadowRoot.querySelector('#start-date');
    const endDateInput = this.shadowRoot.querySelector('#end-date');

    startDateInput.addEventListener('input', () => {
      const startDate = startDateInput.value;
      if (startDate) {
        endDateInput.setAttribute('min', startDate);
      }
    });

    const interestTypeSelect = this.shadowRoot.querySelector('#interest-type');
    const interestRateWrapper = this.shadowRoot.querySelector('#interest-rate-wrapper');

    interestTypeSelect.addEventListener('change', () => {
      if (interestTypeSelect.value === 'none') {
        interestRateWrapper.classList.add('hidden');
      } else {
        interestRateWrapper.classList.remove('hidden');
      }
    });

    ['#title', '#value', '#start-date', '#interest-rate'].forEach((selector) => {
      const inputWrapper = this.shadowRoot.querySelector(selector);
      inputWrapper?.addEventListener('input', () => this.handleInputChange());
    });
  }

  close() {
    super.close();
    this.editingId = null;

    this.setInputValue('#title', '');
    this.setInputValue('#value', '');
    this.setInputValue('#start-date', '');
    this.setInputValue('#end-date', '');

    const valueInput = this.shadowRoot.querySelector('#value');
    if (valueInput) {
      valueInput.currencyType = i18n.getTranslation('common.currency');
    }

    const interestTypeSelect = this.shadowRoot.querySelector('#interest-type');
    if (interestTypeSelect) {
      interestTypeSelect.value = 'none';
    }

    this.clearErrors();
  }
}

if (!customElements.get('investment-modal')) {
  customElements.define('investment-modal', InvestmentModal);
}

export default InvestmentModal;
