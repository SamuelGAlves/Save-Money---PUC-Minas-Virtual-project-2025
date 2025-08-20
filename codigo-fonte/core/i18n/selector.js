import { i18n } from './i18n.js';
import { navbarStore } from '../store/navbarStore.js';

class LanguageSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isCompact = false;
    this._isFixed = false;
  }

  static get observedAttributes() {
    return ['compact', 'fixed'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'compact') {
      this._isCompact = newValue !== null;
      this.render();
    }
    if (name === 'fixed') {
      this._isFixed = newValue !== null;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this._unsubscribe = navbarStore.listen(() => {
      this._isCompact = navbarStore.collapsed;
      this.render();
    });
  }

  disconnectedCallback() {
    const select = this.shadowRoot.querySelector('#language-select');
    const icon = this.shadowRoot.querySelector('.language-icon');
    if (select) {
      select.removeEventListener('change', this.handleLanguageChange);
    }
    if (icon) {
      icon.removeEventListener('click', this.handleIconClick);
    }
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  handleLanguageChange = async (event) => {
    const newLanguage = event.target.value;
    localStorage.setItem('preferredLanguage', newLanguage);
    await i18n.setLanguage(newLanguage);
  }


  render() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
      }

      .language-selector {
        padding: 8px;
        border-radius: 100px;
        background: var(--header-background-color);
        border: 1px solid var(--navbar-border-color);
        margin-bottom: 1rem;
        position: relative;
      }

      .language-icon {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        color: var(--color-white);
      }

      .language-icon:hover {
        opacity: 0.8;
      }

      select {
        padding: 2px;
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        font-size: .8rem;
        cursor: pointer;
        color: var(--color-white);
        background: var(--header-background-color);
        width: 100%;
      }

      select:hover {
        border-color: var(--color-secondar);
      }

      select:focus {
        outline: none;
        border-color: var(--color-secondar);
        box-shadow: 0 0 0 2px var(--color-secondar);
      }

      .compact-mode {
        padding: 4px;
      }

      .compact-mode select {
        position: absolute;
        top: 0;
        right: 0;
        height: 40px;
        margin-top: 0;
        opacity: 0;
        z-index: 1000;
        min-width: 150px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }

      .compact-mode select option {
        padding: 8px;
      }

      .fixed-mode {
        position: fixed;
        top: 20px;
        right: 5rem;
        z-index: 1000;
        margin: 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .fixed-mode:hover {
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
    `;

    const template = document.createElement('div');
    template.className = `language-selector ${this._isCompact ? 'compact-mode' : ''} ${this._isFixed ? 'fixed-mode' : ''}`;

    if (this._isCompact) {
      template.innerHTML = `
        <div class="language-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <select id="language-select">
          <option value="pt-BR">(BR) Português</option>
          <option value="en-US">(US) English</option>
          <option value="es-ES">(ES) Español</option>
          <option value="fr-FR">(FR) Français</option>
          <option value="ar-SA">(SA) العربية</option>
          <option value="ru-RU">(RU) Русский</option>
          <option value="zh-CN">(CN) 中文简体</option>
          <option value="zu-ZA">(ZA) isiZulu</option>
          <option value="hi-IN">(IN) हिन्दी</option>
        </select>
      `;
    } else {
      template.innerHTML = `
        <select id="language-select">
          <option value="pt-BR">(BR) Português</option>
          <option value="en-US">(US) English</option>
          <option value="es-ES">(ES) Español</option>
          <option value="fr-FR">(FR) Français</option>
          <option value="ar-SA">(SA) العربية</option>
          <option value="ru-RU">(RU) Русский</option>
          <option value="zh-CN">(CN) 中文简体</option>
          <option value="zu-ZA">(ZA) isiZulu</option>
          <option value="hi-IN">(IN) हिन्दी</option>
        </select>
      `;
    }

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(template);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const select = this.shadowRoot.querySelector('#language-select');

    const savedLanguage = localStorage.getItem('preferredLanguage') || 'pt-BR';

    if (select) {
      select.value = savedLanguage;
      select.addEventListener('change', this.handleLanguageChange);
    }

    if (i18n.currentLanguage !== savedLanguage) {
      i18n.setLanguage(savedLanguage);
    }
  }
}

if (!customElements.get('language-selector')) {
  customElements.define('language-selector', LanguageSelector);
}

export default LanguageSelector;
