import { i18n } from '../../i18n/i18n.js';
import { navbarStore } from '../../store/navbarStore.js';
import authService from '../../services/auth.js';
import '../../i18n/selector.js';

class AppNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._handleResize = this._handleResize.bind(this);
    this._onNavClick = this._onNavClick.bind(this);
    this._updateActiveLinkBound = this._updateActiveLink.bind(this);
    this._isAuthenticated = false;
    this._isMobile = window.innerWidth <= 900;
    this._translations = null;
    this._menuConfig = {
      authenticated: [
        {
          title: 'navigation.main',
          items: [
            { href: '/', icon: 'home', text: 'navigation.home' },
            { href: '/sobre', icon: 'groups', text: 'navigation.about' },
            { href: '/contato', icon: 'contact_mail', text: 'navigation.contact' }
          ]
        },
        {
          title: 'navigation.management',
          items: [
            { href: '/perfil', icon: 'person', text: 'navigation.profile' },
            // { href: '/testes', icon: 'bug_report', text: 'navigation.tests' }
          ]
        },
        {
          title: 'navigation.finances',
          items: [
            { href: '/investimentos', icon: 'trending_up', text: 'navigation.investments' },
            { href: '/receitas', icon: 'savings', text: 'navigation.income' },
            { href: '/despesas', icon: 'trending_down', text: 'navigation.expenses' },
            // { href: '/categorias', icon: 'sell', text: 'navigation.categories' },
            { href: '/conversor-moedas', icon: 'currency_exchange', text: 'navigation.currency_converter' },
            // { href: '/codigo-fonte/lembretes-contas/index.html', icon: 'hourglass_bottom', text: 'navigation.reminders', type: 'normal' },
            // { href: '/codigo-fonte/metas-financeiras/index.html', icon: 'track_changes', text: 'navigation.goals', type: 'normal' },
            { href: '/codigo-fonte/relatorios/relatorios.html', icon: 'assessment', text: 'navigation.reports', type: 'normal' }
          ]
        },
      ],
      unauthenticated: [
        {
          title: 'navigation.main',
          items: [
            { href: '/login', icon: 'login', text: 'navigation.login' },
            { href: '/registration', icon: 'person_add', text: 'navigation.register' },
            { href: '/esqueceu', icon: 'lock_reset', text: 'navigation.resetPassword' },
            { href: '/conversor-moedas', icon: 'currency_exchange', text: 'navigation.currency_converter' }
          ]
        },
        {
          title: 'navigation.information',
          items: [
            { href: '/sobre', icon: 'groups', text: 'navigation.about' },
            { href: '/contato', icon: 'contact_mail', text: 'navigation.contact' },
            { href: '/testes', icon: 'bug_report', text: 'navigation.tests' }
          ]
        }
      ]
    };
  }

  _getTranslations() {
    if (!this._translations) {
      this._translations = {
        navigation: {
          toggle: i18n.getTranslation('navigation.toggle'),
          main: i18n.getTranslation('navigation.main'),
          home: i18n.getTranslation('navigation.home'),
          profile: i18n.getTranslation('navigation.profile'),
          contact: i18n.getTranslation('navigation.contact'),
          finances: i18n.getTranslation('navigation.finances'),
          investments: i18n.getTranslation('navigation.investments'),
          income: i18n.getTranslation('navigation.income'),
          expenses: i18n.getTranslation('navigation.expenses'),
          categories: i18n.getTranslation('navigation.categories'),
          management: i18n.getTranslation('navigation.management'),
          reminders: i18n.getTranslation('navigation.reminders'),
          goals: i18n.getTranslation('navigation.goals'),
          reports: i18n.getTranslation('navigation.reports'),
          settings: i18n.getTranslation('navigation.settings'),
          login: i18n.getTranslation('navigation.login'),
          register: i18n.getTranslation('navigation.register'),
          resetPassword: i18n.getTranslation('navigation.resetPassword'),
          information: i18n.getTranslation('navigation.information'),
          about: i18n.getTranslation('navigation.about'),
          tests: i18n.getTranslation('navigation.tests'),
          currency_converter: i18n.getTranslation('navigation.currency_converter'),
          logout: i18n.getTranslation('profile.actions.logout')
        }
      };
    }
    return this._translations;
  }

  async connectedCallback() {
    this._i18nUnsubscribe = i18n.addObserver(() => {
      this._translations = null;
      this._updateTranslations();
      this.render();
      this._applyCollapsedState(navbarStore.collapsed);
    });

    // Inicializa o estado mobile
    this._isMobile = window.innerWidth <= 900;
    if (this._isMobile) {
      navbarStore.collapsed = true;
      this._setupEscKey();
    }

    await this._fullRender();
    window.addEventListener('hashchange', this._updateActiveLinkBound);
    window.addEventListener('popstate', this._updateActiveLinkBound);
    window.addEventListener('resize', this._handleResize);
    this._setupToggleListeners();
    this.setupLogoutModal();
  }

  _updateTranslations() {
    const translations = this._getTranslations();
    const elements = {
      toggleBtn: this.shadowRoot.getElementById('toggle-btn'),
      settingsLink: this.shadowRoot.querySelector('a[href*="configuracoes"] span'),
      navGroups: this.shadowRoot.querySelectorAll('.nav-group-title'),
      navLinks: this.shadowRoot.querySelectorAll('a[data-link] span, .nav-link span'),
      logoutBtn: this.shadowRoot.querySelector('.logout-button span')
    };

    if (elements.toggleBtn) {
      elements.toggleBtn.setAttribute('aria-label', translations.navigation.toggle);
    }

    if (elements.settingsLink) {
      elements.settingsLink.textContent = translations.navigation.settings;
    }

    if (elements.logoutBtn) {
      elements.logoutBtn.textContent = translations.navigation.logout;
    }

    // Atualiza títulos dos grupos
    elements.navGroups.forEach((title, index) => {
      const group = this._isAuthenticated
        ? this._menuConfig.authenticated[index]
        : this._menuConfig.unauthenticated[index];
      if (group) {
        title.textContent = translations.navigation[group.title.split('.')[1]];
      }
    });

    // Atualiza textos dos links
    elements.navLinks.forEach((span) => {
      const link = span.closest('a[data-link], .nav-link');
      if (link) {
        const icon = link.querySelector('app-icon');
        if (icon) {
          const menuGroups = this._isAuthenticated
            ? this._menuConfig.authenticated
            : this._menuConfig.unauthenticated;

          for (const group of menuGroups) {
            const item = group.items.find(item => item.icon === icon.textContent);
            if (item) {
              span.textContent = translations.navigation[item.text.split('.')[1]];
              break;
            }
          }
        }
      }
    });

    // Reconfigura os event listeners após a atualização
    this._setupToggleListeners();
    this.setupLogoutModal();
  }

  disconnectedCallback() {
    if (this._unsubscribe) this._unsubscribe();
    if (this._i18nUnsubscribe) this._i18nUnsubscribe();
    window.removeEventListener('hashchange', this._updateActiveLinkBound);
    window.removeEventListener('popstate', this._updateActiveLinkBound);
    window.removeEventListener('resize', this._handleResize);
    this._cleanupToggleListeners();
  }

  _setupToggleListeners() {
    const toggleBtn = this.shadowRoot.getElementById('toggle-btn');
    if (toggleBtn) {
      const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navbarStore.toggle();
      };

      toggleBtn.onclick = handleToggle;
      toggleBtn.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleToggle(e);
        }
      };
    }
  }

  _cleanupToggleListeners() {
    const toggleBtn = this.shadowRoot.getElementById('toggle-btn');
    if (toggleBtn) {
      toggleBtn.onclick = null;
      toggleBtn.onkeydown = null;
    }
  }

  _setupEscKey() {
    if (!this._handleEscKey) {
      this._handleEscKey = (event) => {
        if (event.key === 'Escape' && !navbarStore.collapsed) {
          navbarStore.toggle();
        }
      };
      document.addEventListener('keydown', this._handleEscKey);
    }
  }

  _handleResize() {
    const wasMobile = this._isMobile;
    this._isMobile = window.innerWidth <= 900;

    // Só atualiza o estado se mudou de desktop para mobile ou vice-versa
    if (this._isMobile !== wasMobile) {
      // No desktop, força expandido
      if (!this._isMobile) {
        navbarStore.collapsed = false;
        if (this._handleEscKey) {
          document.removeEventListener('keydown', this._handleEscKey);
          this._handleEscKey = null;
        }
      } else {
        // No mobile, força fechado
        navbarStore.collapsed = true;
        this._setupEscKey();
      }

      this._applyCollapsedState(navbarStore.collapsed);
      this._updateToggleBtnIcon();
    }
  }

  _handleMobileToggle() {
    // Só fecha o menu no mobile se estiver aberto
    if (this._isMobile && !navbarStore.collapsed) {
      navbarStore.toggle();
    }
  }

  async _fullRender() {
    this._isAuthenticated = await authService.isAuthenticated();
    this.render();
    this._applyCollapsedState(navbarStore.collapsed);
    this._addNavListeners();
    this._updateActiveLink();
    this._unsubscribe = navbarStore.listen(() => {
      this._applyCollapsedState(navbarStore.collapsed);
      this._updateToggleBtnIcon();
    });
  }

  _addNavListeners() {
    if (this._navClickAdded) {
      this.shadowRoot.removeEventListener('click', this._onNavClick);
      this._navClickAdded = false;
    }
    this.shadowRoot.addEventListener('click', this._onNavClick);
    this._navClickAdded = true;
    this._addToggleBtnListeners();
  }

  _onNavClick(e) {
    const link = e.target.closest('app-link[data-link]');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');
      history.pushState(null, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
      this._handleMobileToggle();
    }
  }

  _addToggleBtnListeners() {
    const toggleBtn = this.shadowRoot.getElementById('toggle-btn');
    if (toggleBtn) {
      toggleBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navbarStore.toggle();
      };
      toggleBtn.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navbarStore.toggle();
        }
      };
    }
  }

  _applyCollapsedState(collapsed = navbarStore.collapsed) {
    const nav = this.shadowRoot.querySelector('nav');
    if (nav) nav.classList.toggle('collapsed', collapsed);
    const darkToggle = this.shadowRoot.querySelector('dark-mode-toggle');
    if (darkToggle) {
      if (collapsed) {
        darkToggle.removeAttribute('text');
      } else {
        darkToggle.setAttribute('text', '');
      }
    }
  }

  _updateToggleBtnIcon() {
    const toggleBtn = this.shadowRoot.getElementById('toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = navbarStore.collapsed
        ? '<app-icon>arrow_menu_close</app-icon>'
        : '<app-icon>arrow_menu_open</app-icon>';
    }
  }

  _updateActiveLink() {
    const currentPath = location.pathname || '/';
    const links = this.shadowRoot.querySelectorAll('app-link[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '/') {
        link.classList.toggle('active', currentPath === '/');
      } else {
        link.classList.toggle('active', currentPath.startsWith(href));
      }
    });
    this._handleMobileToggle();
  }

  _renderMenuGroup(group) {
    const translations = this._getTranslations();
    return `
      <div class="nav-group">
        <div class="nav-group-title">${translations.navigation[group.title.split('.')[1]]}</div>
        ${group.items.map(item => {
          if (item.type === 'normal') {
            return `
              <a href="${item.href}" class="nav-link">
                <div class="nav-group-item">
                  <app-icon>${item.icon}</app-icon>
                  <span>${translations.navigation[item.text.split('.')[1]]}</span>
                </div>
              </a>
            `;
          }
          return `
            <app-link href="${item.href}" data-link no-style>
              <div class="nav-group-item">
                <app-icon>${item.icon}</app-icon>
                <span>${translations.navigation[item.text.split('.')[1]]}</span>
              </div>
            </app-link>
          `;
        }).join('')}
      </div>
    `;
  }

  _renderMenu() {
    const menuGroups = this._isAuthenticated
      ? this._menuConfig.authenticated
      : this._menuConfig.unauthenticated;

    return menuGroups.map(group => this._renderMenuGroup(group)).join('');
  }

  render() {
    const isCollapsed = navbarStore.collapsed;
    const translations = this._getTranslations();

    if (!this.shadowRoot) {
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex: 1;
          overflow-y: auto;
        }
        nav {
          display: flex;
          flex-direction: column;
          width: 240px;
          position: relative;
          height: 100%;
          flex: 1;
        }
        .navbar-menu {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          border-top: 2px solid var(--navbar-border-color);
        }
        nav.collapsed {
          width: 60px;
        }
        #toggle-btn {
          width: 40px;
          height: 40px;
          border-radius: 100%;
          border-left: 2px solid var(--navbar-border-color);
          background: linear-gradient(to right, var(--navbar-toggle-bg) 50%, transparent 50%);
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: -19px;
          top: 28px;
          z-index: 11;
          color: var(--navbar-toggle-icon-color);
        }
        #toggle-btn app-icon {
          margin: 0;
          transform: translateX(-6px);
        }
        #toggle-btn:hover svg path {
          fill: var(--navbar-toggle-hover-color);
        }
        .nav-group {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 0;
          border-bottom: 2px solid var(--navbar-border-color);
        }
        .nav-group:first-child {
          margin-top: 0;
        }
        .nav-group-title {
          padding: 0.5rem 2rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--navbar-group-title-color);
          letter-spacing: 0.5px;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        nav.collapsed .nav-group-title {
          display: none;
        }
        .logout-button, app-link {
          color: var(--navbar-link-color);
          text-decoration: none;
          font-size: 1rem;
          transition: all 0.2s ease;
          padding: 1rem 2rem;
          white-space: nowrap;
          display: flex;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          cursor: pointer;
        }
        .logout-button:hover, app-link:hover {
          background-color: var(--navbar-link-hover-bg);
          color: var(--navbar-link-hover-color);
          position: relative;
        }
        .nav-group-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        app-link:hover::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 8px;
          background-color: var(--navbar-link-hover-color);
        }
        app-link.active {
          background-color: var(--navbar-link-active-bg);
          color: var(--navbar-link-active-color);
          font-weight: 500;
          position: relative;
        }
        app-link.active::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 8px;
          background-color: var(--navbar-link-active-hover-bg);
        }
        app-link.active:hover {
          background-color: var(--navbar-link-active-hover-bg);
        }
        app-link.active:hover::after {
          background-color: var(--navbar-link-active-bg);
        }
        nav.collapsed app-link {
          font-size: 0;
          padding: 1rem;
          justify-content: center;
          text-align: center;
        }
        nav.collapsed app-link::before {
          margin-right: 0;
          content: attr(data-icon);
          font-size: 1.2rem;
        }
        .navbar-bottom {
          margin-top: auto;
          padding-top: .5rem;
          border-top: 2px solid var(--navbar-border-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          position: sticky;
          bottom: 0;
          background-color: var(--header-background-color);
          z-index: 10;
          dark-mode-toggle {
            padding: 0 .5rem .5rem;
          }
        }
        app-icon {
          margin: 0 1rem 0 0;
          transition: margin 0.2s ease;
        }
        nav.collapsed app-icon {
          margin: 0;
        }
        nav.collapsed .logout-button {
          padding: 1rem;
          justify-content: center;
          span {
            font-size: 0;
          }
        }
        .logout-button {
          border: none;
          border-top: 2px solid var(--navbar-border-color);
          background: none;
          display: flex;
          align-items: center;
        }
        .nav-link {
          color: var(--navbar-link-color);
          text-decoration: none;
          font-size: 1rem;
          transition: all 0.2s ease;
          padding: 1rem 2rem;
          white-space: nowrap;
          display: flex;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          cursor: pointer;
        }
        .nav-link:hover {
          background-color: var(--navbar-link-hover-bg);
          color: var(--navbar-link-hover-color);
          position: relative;
        }
        .nav-link:hover::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 8px;
          background-color: var(--navbar-link-hover-bg);
        }
        nav.collapsed .nav-link {
          font-size: 0;
          padding: 1rem;
          justify-content: center;
          text-align: center;
        }
      </style>
      <div
        id="toggle-btn"
        role="button"
        tabindex="0"
        aria-label="${translations.navigation.toggle}"
        aria-expanded="${!isCollapsed}"
      >
        ${isCollapsed ? '<app-icon>arrow_menu_close</app-icon>' : '<app-icon>arrow_menu_open</app-icon>'}
      </div>
      <nav>
        <div class="navbar-menu">
          ${this._renderMenu()}
        </div>
        <div class="navbar-bottom">
          <language-selector ${isCollapsed ? 'compact' : ''}></language-selector>
          <dark-mode-toggle></dark-mode-toggle>
          ${this._isAuthenticated ? `
            <button class="logout-button" id="logoutBtn">
              <app-icon>logout</app-icon>
              <span>${translations.navigation.logout}</span>
            </button>
          ` : ''}
        </div>
      </nav>
      <logout-modal></logout-modal>
    `;

    // Reconfigura os event listeners após a renderização
    this._setupToggleListeners();
    this.setupLogoutModal();
    this._addNavListeners();
  }

  setupLogoutModal() {
    const logoutBtn = this.shadowRoot.querySelector('.logout-button');
    const logoutModal = this.shadowRoot.querySelector('logout-modal');
    if (logoutBtn && logoutModal) {
      logoutBtn.onclick = () => {
        logoutModal.open();
      };
    } else {
      console.error('Elementos não encontrados:', { logoutBtn, logoutModal });
    }
  }
}

if (!customElements.get('app-navbar')) {
  customElements.define('app-navbar', AppNavbar);
}

export default AppNavbar;
