export function applyInitialTheme() {
  const savedPreference = localStorage.getItem('darkMode');
  const isDarkMode =
    savedPreference !== null
      ? savedPreference === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

  const body = document.body;
  if (isDarkMode) {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    updateThemeColor('#1c1c1c');
  } else {
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
    updateThemeColor('#339999');
  }
}

// Função para atualizar a meta tag theme-color
function updateThemeColor(color) {
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    document.head.appendChild(metaThemeColor);
  }
  metaThemeColor.content = color;
}

// Autochamada
applyInitialTheme();

class DarkModeToggle extends HTMLElement {
  static get observedAttributes() {
    return ['text', 'fixed'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.showText = this.hasAttribute('text');
    this.isDarkMode = document.body.classList.contains('dark-mode');
    this.type = this.getAttribute('type') || 'default';
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'text') {
      this.showText = this.hasAttribute('text');
      this.render();
    }
    if (name === 'type') {
      this.type = newValue || 'default';
      this.render();
    }
  }

  updateTheme() {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      updateThemeColor('#1c1c1c');
      updateBackgroundColor('#1c1c1c');
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
      updateThemeColor('#339999');
      updateBackgroundColor('#339999');
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode);
    this.updateTheme();
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          width: 100%;
          box-sizing: border-box;
        }

        :host([type="fixed"]) {
          position: fixed;
          top: 1rem;
          right: 1rem;
          width: auto;
          z-index: 100;
        }

        :host([type="fixed"]) app-button {
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :host([type="fixed"]) app-icon {
          margin: 0;
        }

        span {
          display: ${this.showText ? 'inline' : 'none'};
        }
      </style>
      <app-button id="dark-mode-toggle" fullwidth="true">
        ${this.isDarkMode
          ? '<app-icon>dark_mode</app-icon><span>Dark Mode</span>'
          : '<app-icon>light_mode</app-icon><span>Light Mode</span>'}
      </app-button>
    `;

    this.shadowRoot.querySelector('#dark-mode-toggle')
      .addEventListener('click', () => this.toggleDarkMode());
  }
}

if (!customElements.get('dark-mode-toggle')) {
  customElements.define('dark-mode-toggle', DarkModeToggle);
}

export default DarkModeToggle;
