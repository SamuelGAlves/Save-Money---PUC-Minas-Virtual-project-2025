class AppLink extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['href', 'class', 'target', 'no-style'];
  }

  connectedCallback() {
    this.render();
    this.addClickHandler();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.addClickHandler();
    }
  }

  addClickHandler() {
    const link = this.shadowRoot.querySelector('a');
    if (link) {
      link.addEventListener('click', (e) => {
        const href = this.getAttribute('href');
        const target = this.getAttribute('target');

        // Se for link externo ou target diferente de _self, permite comportamento padrão
        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || target === '_blank') {
          return;
        }

        // Previne o comportamento padrão
        e.preventDefault();

        // Navega usando o router
        history.pushState(null, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
  }

  render() {
    const href = this.getAttribute('href') || '#';
    const className = this.getAttribute('class') || '';
    const target = this.getAttribute('target') || '_self';
    const noStyle = this.hasAttribute('no-style');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline;
        }
        a {
          text-decoration: none;
          cursor: pointer;
          ${!noStyle ? `
            color: var(--color-primary);
          ` : `
            color: inherit;
          `}
        }
        ${!noStyle ? `
        a:hover {
          text-decoration: underline;
        }
        a:visited {
          color: var(--color-secondary);
        }
        ` : ''}
      </style>
      <a href="${href}" class="${className}" target="${target}">
        <slot></slot>
      </a>
    `;
  }
}

customElements.define('app-link', AppLink);

export default AppLink;
