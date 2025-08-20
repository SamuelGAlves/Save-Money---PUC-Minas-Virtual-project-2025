class AppTextarea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'label',
      'value',
      'id',
      'error',
      'disabled',
      'readonly',
      'placeholder',
      'rows',
      'maxlength'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'value' && this.textarea) {
        this.textarea.value = newValue;
      } else if ((name === 'disabled' || name === 'readonly') && this.textarea) {
        if (newValue !== null) {
          this.textarea.setAttribute(name, '');
        } else {
          this.textarea.removeAttribute(name);
        }
      } else if (name === 'placeholder' && this.textarea) {
        if (newValue !== null) {
          this.textarea.setAttribute('placeholder', newValue);
        } else {
          this.textarea.removeAttribute('placeholder');
        }
      } else {
        this.render();
      }
    }
  }

  get textarea() {
    return this.shadowRoot.querySelector('textarea');
  }

  set value(val) {
    this.setAttribute('value', val);
    if (this.textarea && this.textarea.value !== val) {
      this.textarea.value = val;
    }
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const textarea = this.textarea;
    if (textarea) {
      textarea.addEventListener('input', (e) => {
        this.value = e.target.value;
        this.dispatchEvent(new CustomEvent('change', {
          detail: { value: this.value },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  render() {
    const label = this.getAttribute('label') || '';
    const value = this.getAttribute('value') || '';
    const id = this.getAttribute('id') || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${id}-error`;
    const error = this.getAttribute('error') || '';
    const disabled = this.hasAttribute('disabled') ? 'disabled' : '';
    const readOnly = this.hasAttribute('readonly') ? 'readonly' : '';
    const placeholder = this.getAttribute('placeholder') || '';
    const rows = this.getAttribute('rows') || '4';
    const maxlength = this.getAttribute('maxlength') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        label {
          font-size: 0.9rem;
          color: var(--input-label-color);
          display: block;
        }
        textarea {
          width: 100%;
          padding: 0.6rem;
          margin-top: 0.25rem;
          border: 2px solid var(--input-border-color);
          border-radius: 6px;
          font-size: 1rem;
          box-sizing: border-box;
          color: var(--input-text-color);
          background-color: var(--input-background-color);
          resize: vertical;
          min-height: 100px;
        }
        textarea.error {
          border-color: var(--input-error-border-color);
        }
        .error-message {
          color: var(--input-error-text-color);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        /* Estilo para textarea disabled */
        textarea:disabled {
          background-color: var(--input-disabled-background-color);
          color: var(--input-disabled-text-color);
          border-color: var(--input-disabled-border-color, #ccc);
          cursor: not-allowed;
        }

        /* Estilo para textarea readonly */
        textarea[readonly] {
          background-color: var(--input-readonly-background-color);
          color: var(--input-readonly-text-color);
          border-color: var(--input-readonly-border-color, #bbb);
          cursor: default;
        }
      </style>
      <label for="${id}">
        ${label}
        <textarea
          id="${id}"
          rows="${rows}"
          ${maxlength ? `maxlength="${maxlength}"` : ''}
          placeholder="${placeholder}"
          ${disabled}
          ${readOnly}
        >${value}</textarea>
      </label>
      <div id="${errorId}" class="error-message" aria-live="assertive">${error}</div>
    `;
  }
}

if (!customElements.get('app-textarea')) {
  customElements.define('app-textarea', AppTextarea);
}

export default AppTextarea;
