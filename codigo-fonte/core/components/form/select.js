import { i18n } from '../../i18n/i18n.js';

class AppSelect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    i18n.addObserver(() => this.render());
  }

  disconnectedCallback() {
    i18n.removeObserver(() => this.render());
  }

  static get observedAttributes() {
    return ['label', 'value', 'id', 'error', 'disabled', 'required'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  get select() {
    return this.shadowRoot.querySelector('select');
  }

  get value() {
    return this.select?.value || '';
  }

  set value(val) {
    this.setAttribute('value', val);
    if (this.select) this.select.value = val;
  }

  setError(message) {
    const select = this.select;
    select.classList.add('error');
    select.setAttribute('aria-invalid', 'true');
    const errorMessage = this.shadowRoot.querySelector('.error-message');
    errorMessage.textContent = message;
    select.setAttribute('aria-describedby', errorMessage.id);
  }

  clearError() {
    const select = this.select;
    select.classList.remove('error');
    select.removeAttribute('aria-invalid');
    const errorMessage = this.shadowRoot.querySelector('.error-message');
    errorMessage.textContent = '';
    select.removeAttribute('aria-describedby');
  }

  validate() {
    if (this.hasAttribute('required') && !this.value) {
      this.setError(i18n.getTranslation('input.select.required'));
      return false;
    }
    this.clearError();
    return true;
  }

  render() {
    const label = this.getAttribute('label') || '';
    const id = this.getAttribute('id') || '';
    const value = this.getAttribute('value') || '';
    const disabled = this.hasAttribute('disabled') ? 'disabled' : '';
    const required = this.hasAttribute('required') ? 'required' : '';
    const errorId = `error-${id}`;
    // NOVO: Lê as opções do atributo options (JSON)
    let options = [];
    try {
      options = JSON.parse(this.getAttribute('options') || '[]');
    } catch (e) {
      options = [];
    }
    const optionsHtml = options.map(opt =>
      `<option value="${opt.value}"${opt.selected ? ' selected' : ''}>${opt.label}</option>`
    ).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          margin-bottom: 1rem;
          width: 100%;
          flex-direction: column;
        }
        label {
          font-size: 0.9rem;
          color: var(--input-label-color);
          display: flex;
          width: 100%;
          flex-direction: column;
        }
        select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url('data:image/svg+xml;utf8,<svg fill="gray" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 0.2rem center;
          background-size: 1.5rem;
          width: 100%;
          padding: 0.6rem 2rem 0.6rem 0.6rem;
          margin-top: 0.25rem;
          border: 2px solid var(--input-border-color);
          border-radius: 6px;
          font-size: 1rem;
          color: var(--input-text-color);
          background-color: var(--input-background-color);
        }
        select.error { border-color: var(--input-error-border-color); }
        select:disabled {
          background-color: var(--input-disabled-background-color);
          color: var(--input-disabled-text-color);
          border-color: var(--input-disabled-border-color, #ccc);
          cursor: not-allowed;
        }
        .error-message {
          color: var(--input-error-text-color);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
      </style>
      <label for="${id}">
        ${label}
        <select id="${id}" ${disabled} ${required} aria-describedby="${errorId}">
          ${optionsHtml}
        </select>
      </label>
      <div id="${errorId}" class="error-message" aria-live="assertive"></div>
    `;

    const select = this.select;
    if (value) select.value = value;

    select.addEventListener('change', () => {
      this.validate();
      // Dispara evento change no próprio componente para fora do shadow DOM
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });
    if (this.hasAttribute('required')) this.validate();
  }
}

if (!customElements.get('app-select')) {
  customElements.define('app-select', AppSelect);
}

export default AppSelect;
