const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      --icon-size: 24px;
      --icon-color: inherit;
      --icon-margin: 0;
      margin: var(--icon-margin);
    }

    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined', sans-serif;
      font-weight: normal;
      font-style: normal;
      font-size: var(--icon-size);
      color: var(--icon-color);
      display: inline-block;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      white-space: nowrap;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
  </style>
  <span class="icon material-symbols-outlined"></span>
`;

class AppIcon extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'color', 'margin'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.iconElement = this.shadowRoot.querySelector('.icon');
  }

  connectedCallback() {
    this.update();
    this.observeTextChanges();
  }

  disconnectedCallback() {
    if (this.textObserver) {
      this.textObserver.disconnect();
    }
  }

  observeTextChanges() {
    this.textObserver = new MutationObserver(() => {
      this.update();
    });

    this.textObserver.observe(this, {
      characterData: true,
      childList: true,
      subtree: true
    });
  }

  attributeChangedCallback() {
    this.update();
  }

  update() {
    const iconText = this.textContent.trim();
    const sizeAttr = this.getAttribute('size') || 'medium';
    const colorAttr = this.getAttribute('color') || 'default';
    const marginAttr = this.getAttribute('margin') || '0';

    const sizeMap = {
      small: '16px',
      medium: '24px',
      large: '32px',
      xlarge: '40px'
    };

    const colorMap = {
      default: 'inherit',
      primary: '#1976d2',
      secondary: '#9c27b0',
      error: '#d32f2f',
      success: '#388e3c',
      warning: '#f57c00',
      info: '#0288d1'
    };

    const resolvedSize = sizeMap[sizeAttr] || sizeAttr;
    const resolvedColor = colorMap[colorAttr] || colorAttr;

    this.style.setProperty('--icon-size', resolvedSize);
    this.style.setProperty('--icon-color', resolvedColor);
    this.style.setProperty('--icon-margin', marginAttr);
    this.iconElement.textContent = iconText;
  }
}

customElements.define('app-icon', AppIcon);
export default AppIcon;
