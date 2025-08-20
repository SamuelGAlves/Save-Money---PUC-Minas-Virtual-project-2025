import { navbarStore } from '../../store/navbarStore.js';
import './navbar.js';
import '../common/logo.js';

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._applyCollapsedClass(navbarStore.collapsed);

    // Escutar mudanças no estado collapsed
    this._unsubscribe = navbarStore.listen((collapsed) => {
      this._applyCollapsedClass(collapsed);
    });

    // Adicionar evento de clique no mobile-overlay
    const overlay = this.shadow.querySelector('.mobile-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        navbarStore.collapsed = true;
      });

      // Tornar o overlay acessível com teclado
      overlay.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          navbarStore.collapsed = true;
          event.preventDefault();
        }
      });
    }

    // Adicionar evento de clique no logo
    const logo = this.shadow.querySelector('save-money-logo');
    if (logo) {
      logo.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          navbarStore.toggle();
        }
      });
    }
  }

  disconnectedCallback() {
    if (this._unsubscribe) this._unsubscribe();

    // Remover evento de clique no mobile-overlay
    const overlay = this.shadow.querySelector('.mobile-overlay');
    if (overlay) {
      overlay.removeEventListener('click', () => {
        navbarStore.collapsed = true;
      });

      overlay.removeEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          navbarStore.collapsed = true;
          event.preventDefault();
        }
      });
    }

    // Remover evento de clique no logo
    const logo = this.shadow.querySelector('save-money-logo');
    if (logo) {
      logo.removeEventListener('click', () => {
        if (window.innerWidth <= 900) {
          navbarStore.toggle();
        }
      });
    }
  }

  _applyCollapsedClass(collapsed) {
    const header = this.shadow.querySelector('header');
    const overlay = this.shadow.querySelector('.mobile-overlay');
    const logo = this.shadow.querySelector('save-money-logo');
    const main = document.querySelector('.page-main');

    if(main) {
      main.classList.toggle('collapsed', collapsed);
    }

    header.classList.toggle('collapsed', collapsed);
    overlay.classList.toggle('collapsed', collapsed);

    if (logo) {
      logo.setAttribute('variant', collapsed ? 'small' : 'default');
    }
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        header {
          display: flex;
          align-items: center;
          flex-direction: column;
          background-color: var(--header-background-color);
          font-family: var(--header-font-family);
          color: var(--color-text);
          box-shadow: var(--header-box-shadow);
          border-left: 2px solid var(--navbar-border-color);
          height: 100%;
          box-sizing: border-box;
          position: fixed;
          top: 0;
          right: 0;
          z-index: 11;
        }

        header.collapsed {
          width: var(--header-collapsed-width);
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          top: 0;
          width: 100vw;
          height: 100dvh;
          background: var(--mobile-overlay-background);
          z-index: 99;
          display: none;
          backdrop-filter: var(--mobile-overlay-backdrop-filter);
          cursor: pointer;
        }

        .mobile-overlay.collapsed {
          display: none;
        }

        @media (max-width: 900px) {
          header {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 100;
            box-shadow: var(--header-mobile-box-shadow);
          }
          header.collapsed {
            box-shadow: var(--header-collapsed-box-shadow);
          }
          .mobile-overlay {
            display: block;
          }
        }
      </style>

      <header>
        <save-money-logo disable-redirect></save-money-logo>
        <app-navbar></app-navbar>
      </header>
      <div class="mobile-overlay" role="button" aria-label="Fechar menu" tabindex="0"></div>
    `;
  }
}

if (!customElements.get('app-header')) {
  customElements.define('app-header', AppHeader);
}

export default AppHeader;
