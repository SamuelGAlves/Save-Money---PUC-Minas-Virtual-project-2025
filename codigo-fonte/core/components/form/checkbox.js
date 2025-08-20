import { i18n } from '../../i18n/i18n.js';

class AppCheckbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    i18n.addObserver(() => this.render());
  }

  disconnectedCallback() {
    i18n.removeObserver(() => this.render());
  }

  static get observedAttributes() {
    return ['label', 'checked', 'id', 'error', 'disabled', 'required'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  get input() {
    return this.shadowRoot.querySelector('input[type="checkbox"]');
  }

  get checked() {
    return this.input?.checked || false;
  }

  set checked(val) {
    if (val) this.setAttribute('checked', '');
    else this.removeAttribute('checked');
    if (this.input) this.input.checked = !!val;
  }

  setError(message) {
    const input = this.input;
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    const errorMessage = this.shadowRoot.querySelector('.error-message');
    errorMessage.textContent = message;
    input.setAttribute('aria-describedby', errorMessage.id);
  }

  clearError() {
    const input = this.input;
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    const errorMessage = this.shadowRoot.querySelector('.error-message');
    errorMessage.textContent = '';
    input.removeAttribute('aria-describedby');
  }

  validate() {
    if (this.hasAttribute('required') && !this.checked) {
      this.setError(i18n.getTranslation('input.checkbox.required'));
      return false;
    }
    this.clearError();
    return true;
  }

  render() {
    const label = this.getAttribute('label') || '';
    const id = this.getAttribute('id') || '';
    const checked = this.hasAttribute('checked') ? 'checked' : '';
    const disabled = this.hasAttribute('disabled') ? 'disabled' : '';
    const required = this.hasAttribute('required') ? 'required' : '';
    const errorId = `error-${id}`;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; margin-bottom: 1rem; }
        label { font-size: 0.95rem; color: var(--input-label-color); display: flex; align-items: center; gap: 0.5rem; }
        input[type="checkbox"] {
          width: 18px; height: 18px;
          accent-color: var(--input-success-color, #28a745);
        }
        input[type="checkbox"].error { outline: 2px solid var(--input-error-border-color); }
        input[type="checkbox"]:disabled { accent-color: #ccc; cursor: not-allowed; }
        .error-message {
          color: var(--input-error-text-color);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
      </style>
      <label for="${id}">
        <input id="${id}" type="checkbox" ${checked} ${disabled} ${required} aria-describedby="${errorId}" />
        ${label}
      </label>
      <div id="${errorId}" class="error-message" aria-live="assertive"></div>
    `;

    const input = this.input;
    input.addEventListener('change', () => {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      this.validate && this.validate();
    });
    if (this.hasAttribute('required')) this.validate();
  }
}

if (!customElements.get('app-checkbox')) {
  customElements.define('app-checkbox', AppCheckbox);
}

export default AppCheckbox;
