class AppButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'aria-label', 'fullwidth', 'href', 'type'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.addEventListener('focus', () => {
      const el = this.shadowRoot.querySelector('button');
      el?.focus();
    });
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    // Torna o host focável se não estiver desabilitado
    if (!this.hasAttribute('disabled')) {
      this.setAttribute('tabindex', '0');
    } else {
      this.removeAttribute('tabindex');
    }
    this.render();
  }

  _handleClick(e) {
    const href = this.getAttribute('href');
    if (href && !this.hasAttribute('disabled')) {
      e.preventDefault();
      history.pushState(null, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const disabled = this.hasAttribute('disabled');
    const ariaLabel = this.getAttribute('aria-label') || '';
    const fullWidth = this.hasAttribute('fullwidth');
    const type = this.getAttribute('type') || 'button';

    const classes = `button ${variant} ${size} ${fullWidth ? 'full-width' : ''}`;

    const commonAttrs = `
      class="${classes}"
      ${ariaLabel ? `aria-label="${ariaLabel}"` : ''}
      ${disabled ? 'aria-disabled="true" tabindex="-1"' : ''}
      role="button"
    `;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          outline: none;
          ${fullWidth ? 'width: 100%;' : ''}
        }

        button {
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 100%;
          font: inherit;
          vertical-align: baseline;
          font-family: inherit;
          border: none;
          cursor: pointer;
          border-radius: var(--button-border-radius);
          padding: 0.5em 1em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5em;
          transition: color 0.3s, border 0.3s, background 0.3s;
          box-shadow: var(--button-box-shadow);
          box-sizing: border-box;
          text-decoration: none;
          text-transform: uppercase;
          font-weight: bold;
          flex-wrap: wrap;
        }

        .primary {
          background: var(--button-primary-bg);
          color: var(--button-primary-text-color);
          border: var(--button-primary-border);
        }
        .primary:hover {
          background: var(--button-primary-hover-bg);
        }

        .secondary {
          background: var(--button-secondary-bg);
          color: var(--button-secondary-text-color);
          border: var(--button-secondary-border);
        }
        .secondary:hover {
          background: var(--button-secondary-hover-bg);
        }

        .danger {
          background: var(--button-danger-bg);
          color: var(--button-danger-text-color);
          border: var(--button-danger-border);
        }
        .danger:hover {
          background: var(--button-danger-hover-bg);
        }

        .ghost {
          background: var(--button-ghost-bg);
          border: var(--button-ghost-border);
          color: var(--button-ghost-text-color);
        }
        .ghost:hover {
          background: var(--button-ghost-hover-bg);
        }

        .sm {
          font-size: var(--button-sm-font-size);
          padding: var(--button-sm-padding);
        }
        .md {
          font-size: var(--button-md-font-size);
          padding: var(--button-md-padding);
        }
        .lg {
          font-size: var(--button-lg-font-size);
          padding: var(--button-lg-padding);
        }

        .full-width {
          width: 100%;
        }

        button:disabled {
          opacity: var(--button-disabled-opacity);
          cursor: not-allowed;
        }
      </style>
      <button ${commonAttrs} ${disabled ? 'disabled' : ''} type="${type}"><slot></slot></button>
    `;

    const button = this.shadowRoot.querySelector('button');
    if (button) {
      button.addEventListener('click', (e) => this._handleClick(e));

      if (type === 'submit') {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const form = this.closest('form');
          if (form) form.requestSubmit();
        });
      }

      if (type === 'reset') {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const form = this.closest('form');
          if (form) form.reset();
        });
      }
    }
  }
}

customElements.define('app-button', AppButton);

export default AppButton;
