import { formatCurrencyCode, currencyOptions } from '../../utils/currency.js';
import { i18n } from '../../i18n/i18n.js';
import toast from '../../services/toast.js';

export class Input extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.type = this.getAttribute('type') || 'text';
    this.label = this.getAttribute('label') || '';
    this.placeholder = this.getAttribute('placeholder') || '';
    this.value = this.getAttribute('value') || '';
    this.required = this.hasAttribute('required');
    this.disabled = this.hasAttribute('disabled');
    this.error = null;
    this.currencyType = this.getAttribute('currency-type') || 'BRL';
    this.currencyOptions = currencyOptions;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    // Remove o observador quando o componente for desconectado
    i18n.removeObserver(() => this.render());
  }

  static get observedAttributes() {
    return [
      'label',
      'type',
      'value',
      'id',
      'error',
      'min',
      'max',
      'inputmode',
      'disabled',
      'readonly',
      'placeholder',
      'minlength',
      'maxlength',
      'show-requirements',
      'tip',
      'currency-type',
      'prevent-copy-paste',
      'autocomplete'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'value' && this.input) {
        this.input.value = newValue;
        this.applyMask();
      } else if ((name === 'min' || name === 'max') && this.input) {
        this.input.setAttribute(name, newValue);
      } else if ((name === 'disabled' || name === 'readonly' || name === 'autocomplete') && this.input) {
        if (newValue !== null) {
          this.input.setAttribute(name, newValue);
        } else {
          this.input.removeAttribute(name);
        }
      } else if (name === 'placeholder' && this.input) {
        if (newValue !== null) {
          this.input.setAttribute('placeholder', newValue);
        } else {
          this.input.removeAttribute('placeholder');
        }
      } else if (name === 'currency-type') {

        const select = this.shadowRoot?.querySelector('.currency-select');
        if (select) {
          select.value = newValue;

        }
        // Reaplica a máscara quando o currency-type muda
        if (this.input) {
          this.applyMask();
        }
      } else if (name === 'error') {
        if (newValue) {
          this.setError(this.input, newValue);
        } else {
          this.clearError();
        }
      } else {
        this.render();
      }
    }
  }

  get input() {
    return this.shadowRoot.querySelector('input');
  }

  set value(val) {
    this.setAttribute('value', val);
    if (this.input && this.input.value !== val) {
      this.input.value = val;
    }
    this.applyMask();
  }

  get value() {
    return this.input?.value || '';
  }

  get rawValue() {
    // Retorna o valor bruto salvo no dataset, garantindo duas casas decimais
    return parseFloat(this.input?.dataset.rawValue || 0).toFixed(2);
  }

  setError(message) {
    const input = this.input;
    if (!input) return;

    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    const errorMessage = this.shadowRoot.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    }

    // Adiciona o aria-describedby ao input para associar a mensagem de erro
    input.setAttribute('aria-describedby', errorMessage?.id || '');
  }

  clearError() {
    const input = this.input;
    if (!input) return;

    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    const errorMessage = this.shadowRoot.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.textContent = '';
      errorMessage.style.display = 'none';
    }

    // Remove o aria-describedby
    input.removeAttribute('aria-describedby');
  }

  applyCurrencyMask(e) {
    const input = e.target;
    const currencyCode = this.currencyType;

    // Lista de criptomoedas
    const CRYPTO_CURRENCIES = [
      'BTC',
      'ETH',
      'BNB',
      'XRP',
      'ADA',
      'SOL',
      'DOT',
      'DOGE',
      'AVAX',
      'MATIC',
    ];

    // Se for uma criptomoeda
    if (CRYPTO_CURRENCIES.includes(currencyCode)) {
      // Remove tudo que não for número ou ponto
      let value = input.value.replace(/[^\d.]/g, '');

      // Se não houver valor, retorna vazio
      if (!value) {
        input.value = `${currencyCode} 0`;
        this.setAttribute('value', `${currencyCode} 0`);
        input.dataset.rawValue = '0';
        return;
      }

      // Se o valor contém ponto, formata com 8 casas decimais
      if (value.includes('.')) {
        // Separa parte inteira e decimal
        const [intPart, decPart = ''] = value.split('.');

        // Limita a parte decimal a 8 dígitos
        const limitedDecPart = decPart.slice(0, 8);

        // Formata o valor final
        value = `${intPart}.${limitedDecPart}`;
      } else {
        // Se não tem ponto, mantém apenas o número inteiro
        value = value.replace(/^0+/, '') || '0';
      }

      // Formata o número com o símbolo da criptomoeda
      const formatted = `${currencyCode} ${value}`;
      input.value = formatted;
      this.setAttribute('value', formatted);
      input.dataset.rawValue = value;
      return;
    }

    // Para moedas tradicionais, mantém a lógica original
    const numeric = input.value.replace(/[^\d]/g, '');

    // Limita o número a 12 dígitos (incluindo centavos)
    const limitedNumeric = numeric.slice(0, 12);

    // Garante que o número tenha duas casas decimais
    const number = limitedNumeric ? parseFloat(limitedNumeric) / 100 : 0;

    // Limita o valor máximo a 999.999.999,99
    const maxValue = 999999999.99;
    const limitedNumber = Math.min(number, maxValue);

    // Verifica se o número foi limitado
    if (number > maxValue) {
      const errorMessage = i18n.getTranslation('input.currency.maxLimit');
      toast.warning(errorMessage);
      this.setError(errorMessage);
    } else if (numeric.length > 12) {
      const errorMessage = i18n.getTranslation('input.currency.digitLimit');
      toast.warning(errorMessage);
      this.setError(errorMessage);
    } else {
      this.clearError();
    }

    const formatted = formatCurrencyCode(limitedNumber, currencyCode);
    input.value = formatted;
    this.setAttribute('value', formatted);
    input.dataset.rawValue = limitedNumber.toFixed(2);
  }

  applyPercentageMask(e) {
    const input = e.target;

    // Salva a posição atual do cursor
    const selectionStart = input.selectionStart;

    // Remove tudo que não é número
    let numeric = input.value.replace(/[^\d]/g, '');

    if (!numeric) numeric = '0';

    // Limita tamanho máximo (opcional)
    if (numeric.length > 8) numeric = numeric.slice(0, 8);

    // Divide para obter o número correto
    const number = parseFloat(numeric) / 100;

    // Formata o valor final
    const formatted = `${number.toFixed(2)}%`;

    // Atualiza o input
    input.value = formatted;
    input.dataset.rawValue = number;

    // Recalcula a nova posição do cursor
    const newCursorPosition = Math.min(selectionStart, input.value.length - 1);

    // Ajusta o cursor de volta
    input.setSelectionRange(newCursorPosition, newCursorPosition);
  }

  applyCpfMask(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '').slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
    this.setAttribute('value', value);
    input.dataset.rawValue = value.replace(/\D/g, '');
  }

  applyCnpjMask(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '').slice(0, 14);
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    input.value = value;
    this.setAttribute('value', value);
    input.dataset.rawValue = value.replace(/\D/g, '');
  }

  applyCepMask(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '').slice(0, 8);
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    input.value = value;
    this.setAttribute('value', value);
    input.dataset.rawValue = value.replace(/\D/g, '');
  }

  applyPhoneMask(e) {
    const input = e.target;
    const raw = input.value.replace(/\D/g, '').slice(0, 11); // só números

    let formatted = raw;

    if (raw.length >= 3) {
      formatted = raw.replace(/^(\d{2})(\d)/, '($1) $2');

      if (raw.length === 11) {
        formatted = formatted.replace(/(\d{5})(\d{4})$/, '$1-$2'); // celular
      } else if (raw.length >= 10) {
        formatted = formatted.replace(/(\d{4})(\d{4})$/, '$1-$2'); // fixo
      }
    }

    input.value = formatted;
    input.dataset.rawValue = raw;
    this.setAttribute('value', formatted);
  }

  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];

    if (password.length < minLength) {
      errors.push(i18n.getTranslation('input.password.minLength'));
    }
    if (!hasUpperCase) {
      errors.push(i18n.getTranslation('input.password.uppercase'));
    }
    if (!hasLowerCase) {
      errors.push(i18n.getTranslation('input.password.lowercase'));
    }
    if (!hasNumbers) {
      errors.push(i18n.getTranslation('input.password.numbers'));
    }
    if (!hasSpecialChar) {
      errors.push(i18n.getTranslation('input.password.specialChar'));
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  applyMask() {
    if (!this.input) return;

    const type = this.getAttribute('type');
    switch (type) {
      case 'currency':
        this.applyCurrencyMask({ target: this.input });
        break;
      case 'percentage':
        this.applyPercentageMask({ target: this.input });
        break;
      case 'cpf':
        this.applyCpfMask({ target: this.input });
        break;
      case 'cnpj':
        this.applyCnpjMask({ target: this.input });
        break;
      case 'cep':
        this.applyCepMask({ target: this.input });
        break;
      case 'tel':
        this.applyPhoneMask({ target: this.input });
        break;
    }
  }

  // Adicionando o método focus
  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const label = this.getAttribute('label') || '';
    const rawType = this.getAttribute('type') || 'text';
    const isCurrency = rawType === 'currency';
    const isPercentage = rawType === 'percentage';
    const isCpf = rawType === 'cpf';
    const isCnpj = rawType === 'cnpj';
    const isCep = rawType === 'cep';
    const isPhone = rawType === 'tel';
    const isPassword = rawType === 'password';
    const showRequirements = this.hasAttribute('show-requirements');
    const preventCopyPaste = this.hasAttribute('prevent-copy-paste');
    const type =
      isCurrency || isPercentage || isCpf || isCnpj || isCep || isPhone ? 'text' : rawType;
    const id = this.getAttribute('id') || '';
    const value = this.getAttribute('value') || '';
    const min = this.getAttribute('min') || '';
    const max = this.getAttribute('max') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const minlength = this.getAttribute('minlength') || '';
    const maxlength = this.getAttribute('maxlength') || '';
    const inputMode =
      this.getAttribute('inputmode') || (isCurrency || rawType === 'number' ? 'numeric' : 'text');
    const tip = this.getAttribute('tip') || '';
    const disabled = this.hasAttribute('disabled') ? 'disabled' : '';
    const readOnly = this.hasAttribute('readonly') ? 'readonly' : '';
    const error = this.getAttribute('error') || '';
    const autocomplete = this.getAttribute('autocomplete') || '';

    const errorId = `error-${id}`;
    const currencyType = this.currencyType;


    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 1rem;
        }
        label {
          font-size: 0.9rem;
          color: var(--input-label-color);
          display: block;
        }
        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        input {
          width: 100%;
          padding: 0.6rem;
          margin-top: 0.25rem;
          border: 2px solid var(--input-border-color);
          border-radius: 6px;
          font-size: 1rem;
          box-sizing: border-box;
          color: var(--input-text-color);
          background-color: var(--input-background-color);
          font-family: Arial, Helvetica, sans-serif;
        }
        input[type="password"] {
          padding-right: 40px;
        }
        .toggle-password {
          position: absolute;
          right: 5px;
          top: calc(50% - -2px);
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          color: var(--input-text-color);
          opacity: 0.7;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toggle-password:hover {
          opacity: 1;
        }
        .toggle-password:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: var(--input-calendar-filter);
        }
        input.error {
          border-color: var(--input-error-border-color);
        }
        .error-message {
          color: var(--input-error-text-color);
          font-size: 0.85rem;
          margin-top: 0.5rem;
          display: none;
        }
        .error-message:not(:empty) {
          display: block;
        }
        .password-requirements {
          font-size: 0.8rem;
          color: var(--input-label-color);
          margin-top: 0.5rem;
          display: none;
        }
        .password-requirements.visible {
          display: block;
        }
        .password-requirements ul {
          margin: 0.25rem 0;
          padding-left: 1.5rem;
        }
        .password-requirements li {
          margin: 0.25rem 0;
          color: var(--input-text-color);
        }
        .password-requirements li.valid {
          color: var(--input-success-color, #28a745);
        }
        .password-requirements li.invalid {
          color: var(--input-text-color);
        }

        .input-tip {
          font-size: 0.85rem;
          color: var(--input-tip-color, #888);
          margin-top: .5rem;
        }

        /* Estilo para input disabled */
        input:disabled {
          background-color: var(--input-disabled-background-color);
          color: var(--input-disabled-text-color);
          border-color: var(--input-disabled-border-color, #ccc);
          cursor: not-allowed;
        }

        /* Estilo para input readonly */
        input[readonly] {
          background-color: var(--input-readonly-background-color);
          color: var(--input-readonly-text-color);
          border-color: var(--input-readonly-border-color, #bbb);
          cursor: not-allowed;
        }

        /* Estilo para select de moeda */
        .currency-select-wrapper {
          position: absolute;
          right: 2px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
        }
        .currency-select {
          background: var(--input-background-color);
          font-size: 1em;
          border-radius: 6px;
          padding: 2px 40px 2px 0px;
          height: 36px;
          width: auto;
          color: var(--input-text-color);
          cursor: pointer;
          text-align: right;
          border: 0;
          transform: translate(0, 2px);
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          width: 145px;
        }
        input.currency-padding {
          padding-right: 90px;
        }
        input.prevent-copy-paste {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        app-icon.currency-icon {
          font-size: 1.3em;
          color: var(--input-text-color);
          opacity: 0.7;
          pointer-events: none;
          user-select: none;
          position: absolute;
          right: 8px;
          top: 9px;
        }
      </style>
      <label for="${id}">
        ${label}
        <div class="input-container">
          <input
            id="${id}"
            type="${type}"
            placeholder="${placeholder}"
            value="${value}"
            min="${min}"
            max="${max}"
            minlength="${minlength}"
            maxlength="${maxlength}"
            inputmode="${inputMode}"
            ${disabled}
            ${readOnly}
            ${autocomplete ? `autocomplete="${autocomplete}"` : ''}
            ${this.hasAttribute('pattern') ? `pattern="${this.getAttribute('pattern')}"` : ''}
            class="${isCurrency ? 'currency-padding' : ''} ${
      preventCopyPaste ? 'prevent-copy-paste' : ''
    } ${error ? 'error' : ''}"
          />
          ${
            isCurrency
              ? `
            <span class="currency-select-wrapper">
              <select class="currency-select" id="currencyType">
                ${
                  this.currencyOptions
                    ?.map(
                      (opt) =>
                        `<option value="${opt.value}" ${
                          currencyType === opt.value ? 'selected' : ''
                        }>${opt.label}</option>`
                    )
                    .join('') || ''
                }
              </select>
              <app-icon class="currency-icon">currency_exchange</app-icon>
            </span>
          `
              : ''
          }
          ${
            isPassword
              ? `
            <button type="button" class="toggle-password" aria-label="Toggle password visibility">
              <app-icon>visibility</app-icon>
            </button>
          `
              : ''
          }
        </div>
        ${tip ? `<div class="input-tip">${tip}</div>` : ''}
        <div id="${errorId}" class="error-message" role="alert">${error}</div>
        ${
          isPassword && showRequirements
            ? `
          <div class="password-requirements visible">
            <p>${i18n.getTranslation('input.password.requirements')}</p>
            <ul>
              <li class="invalid" data-requirement="length">${i18n.getTranslation(
                'input.password.minLength'
              )}</li>
              <li class="invalid" data-requirement="uppercase">${i18n.getTranslation(
                'input.password.uppercase'
              )}</li>
              <li class="invalid" data-requirement="lowercase">${i18n.getTranslation(
                'input.password.lowercase'
              )}</li>
              <li class="invalid" data-requirement="number">${i18n.getTranslation(
                'input.password.numbers'
              )}</li>
              <li class="invalid" data-requirement="special">${i18n.getTranslation(
                'input.password.specialChar'
              )}</li>
            </ul>
          </div>
        `
            : ''
        }
      </label>
    `;

    const input = this.shadowRoot.querySelector('input');
    const passwordRequirements = this.shadowRoot.querySelector('.password-requirements');
    const togglePassword = this.shadowRoot.querySelector('.toggle-password');

    // Adiciona eventos para prevenir copy/paste se necessário
    if (preventCopyPaste) {
      input.addEventListener('copy', (e) => {
        e.preventDefault();
        toast.warning(i18n.getTranslation('input.preventCopyPaste.copy'));
      });
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        toast.warning(i18n.getTranslation('input.preventCopyPaste.paste'));
      });
      input.addEventListener('cut', (e) => {
        e.preventDefault();
        toast.warning(i18n.getTranslation('input.preventCopyPaste.cut'));
      });
      input.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toast.warning(i18n.getTranslation('input.preventCopyPaste.contextMenu'));
      });
    }

    // Seleciona o select de moeda e força o valor correto do i18n se não houver atributo
    if (isCurrency) {
      const select = this.shadowRoot.querySelector('.currency-select');
      if (select) {
        // Se não tem atributo ou está diferente do i18n, força o valor do select
        if (!this.hasAttribute('currency-type')) {
          select.value = this.currencyType;
        }
        select.addEventListener('change', (e) => {
          const newCurrencyType = e.target.value;
          this.currencyType = newCurrencyType;
          this.applyCurrencyMask({ target: input });
          this.dispatchEvent(
            new CustomEvent('currency-type-change', {
              detail: { value: newCurrencyType },
            })
          );
        });
      }
    }

    if (isPassword) {
      // Toggle password visibility
      if (togglePassword) {
        togglePassword.addEventListener('click', () => {
          const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
          input.setAttribute('type', type);

          togglePassword.innerHTML =
            type === 'password'
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>`;

          togglePassword.setAttribute(
            'aria-label',
            type === 'password'
              ? i18n.getTranslation('input.password.show')
              : i18n.getTranslation('input.password.hide')
          );
        });
      }

      input.addEventListener('input', (e) => {
        const password = e.target.value;
        const validation = this.validatePassword(password);

        // Atualiza os indicadores visuais dos requisitos apenas se estiverem visíveis
        if (passwordRequirements) {
          const requirements = this.shadowRoot.querySelectorAll('.password-requirements li');
          requirements.forEach((req) => {
            const requirement = req.dataset.requirement;
            let isValid = false;

            switch (requirement) {
              case 'length':
                isValid = password.length >= 8;
                break;
              case 'uppercase':
                isValid = /[A-Z]/.test(password);
                break;
              case 'lowercase':
                isValid = /[a-z]/.test(password);
                break;
              case 'number':
                isValid = /\d/.test(password);
                break;
              case 'special':
                isValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
                break;
            }

            req.classList.toggle('valid', isValid);
            req.classList.toggle('invalid', !isValid);
          });
        }

        if (!validation.isValid) {
          this.setError(validation.errors[0]);
        } else {
          this.clearError();
        }
      });
    }

    if (isCurrency || isPercentage || isCpf || isCnpj || isCep || isPhone) {
      input.addEventListener('input', this.applyMask.bind(this));
      if (value) this.applyMask();
    }
  }

  // Getter para acessar o código da moeda selecionado
  get currencyType() {
    const value = this.getAttribute('currency-type');

    return value;
  }

  set currencyType(value) {

    if (value) {
      this.setAttribute('currency-type', value);
    } else {
      this.removeAttribute('currency-type');
    }
  }

  validate() {
    const input = this.input;
    if (!input) return true;

    const value = input.value;
    const type = this.getAttribute('type');
    const minlength = parseInt(this.getAttribute('minlength')) || 0;
    const maxlength = parseInt(this.getAttribute('maxlength')) || 0;
    const min = this.getAttribute('min');
    const max = this.getAttribute('max');
    const label = this.getAttribute('label') || '';

    // Validação de comprimento mínimo
    if (minlength > 0 && value.length < minlength) {
      this.setError(i18n.getTranslation('input.minlength', { min: minlength, field: label }));
      return false;
    }

    // Validação de comprimento máximo
    if (maxlength > 0 && value.length > maxlength) {
      this.setError(i18n.getTranslation('input.maxlength', { max: maxlength, field: label }));
      return false;
    }

    // Validação de valor mínimo (para números e datas)
    if (min && (type === 'number' || type === 'date')) {
      const numValue = type === 'number' ? parseFloat(value) : new Date(value).getTime();
      const minValue = type === 'number' ? parseFloat(min) : new Date(min).getTime();
      if (numValue < minValue) {
        this.setError(i18n.getTranslation('input.min', { min, field: label }));
        return false;
      }
    }

    // Validação de valor máximo (para números e datas)
    if (max && (type === 'number' || type === 'date')) {
      const numValue = type === 'number' ? parseFloat(value) : new Date(value).getTime();
      const maxValue = type === 'number' ? parseFloat(max) : new Date(max).getTime();
      if (numValue > maxValue) {
        this.setError(i18n.getTranslation('input.max', { max, field: label }));
        return false;
      }
    }

    this.clearError();
    return true;
  }

  setupEventListeners() {
    const input = this.input;
    if (!input) return;

    input.addEventListener('input', (e) => {
      const maxlength = parseInt(this.getAttribute('maxlength')) || 0;
      const value = e.target.value;
      const label = this.getAttribute('label') || '';

      if (this.hasAttribute('maxlength') && value.length >= maxlength) {
        toast.warning(i18n.getTranslation('input.maxlength', { max: maxlength, field: label }));
      } else {
        this.validate();
      }
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    });

    input.addEventListener('change', () => {
      this.validate();
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });

    input.addEventListener('blur', () => {
      this.validate();
      this.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));
    });
  }
}

if (!customElements.get('app-input')) {
  customElements.define('app-input', Input);
}

export default Input;
