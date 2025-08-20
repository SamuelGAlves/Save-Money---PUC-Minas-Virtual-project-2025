import { navbarStore } from '../../store/navbarStore.js';
import authService from '../../services/auth.js';
import toast from '../../services/toast.js';
import { i18n } from '../../i18n/i18n.js';

class AppRouter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.routes = {};
    this.isLoading = false;
    this.render();
  }

  set config(routes) {
    this.routes = routes;
    this._loadRoute(location.pathname || '/');
  }

  connectedCallback() {
    // Aplica padding inicial com base no estado atual e largura da tela
    this._updatePadding(navbarStore.collapsed);

    // Atualiza padding ao mudar estado do navbar
    this._unsubscribe = navbarStore.listen((collapsed) => {
      this._updatePadding(collapsed);
    });

    // Atualiza padding se a tela for redimensionada
    this._onResize = () => {
      this._updatePadding(navbarStore.collapsed);
    };
    window.addEventListener('resize', this._onResize);

    // Usa um debounce para evitar múltiplas chamadas
    let timeout;
    window.addEventListener('popstate', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Preserva os parâmetros da URL ao carregar a rota
        const currentPath = location.pathname;
        const searchParams = location.search;
        this._loadRoute(currentPath + searchParams);
      }, 100);
    });

    // Adiciona observer para mudanças de idioma
    this._i18nUnsubscribe = i18n.addObserver(() => {
      this._updatePageTitle(location.pathname || '/');
    });
  }

  disconnectedCallback() {
    if (this._unsubscribe) this._unsubscribe();
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this._i18nUnsubscribe) this._i18nUnsubscribe();
    window.removeEventListener('popstate', this._loadRoute);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          transition: padding-left 0.3s ease;
          width: 100%;
        }

        #view {
          position: relative;
          min-height: 100vh;
        }

        .page-transition {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
      <slot></slot>
      <main id="view"></main>
    `;
  }

  _updatePadding(collapsed) {
    const view = this.shadowRoot.getElementById('view');
    const headerExists = !!this.shadowRoot.querySelector('app-header');

    // Só aplica padding se o header estiver presente
    if (headerExists) {
      const isMobile = window.innerWidth <= 900;
      view.style.paddingRight = isMobile ? '60px' : collapsed ? '60px' : '240px';
    } else {
      view.style.paddingRight = '0px';
    }
  }

  _updatePageTitle(path) {
    const basePath = path.split('?')[0];
    const route = this.routes[basePath] || this.routes['/404'];
    const is404Page = basePath === '/404' || route === this.routes['/404'];

    let pageKey;
    if (is404Page) {
      pageKey = 'notFound';
    } else if (basePath === '/') {
      pageKey = 'home';
    } else {
      // Remove a barra inicial e converte para o formato correto da chave
      pageKey = basePath.replace('/', '');
      // Mapeia as chaves especiais
      const keyMap = {
        'receitas': 'income',
        'despesas': 'expenses',
        'categorias': 'categories',
        'metas': 'goals',
        'relatorios': 'reports',
        'investimentos': 'investments',
        'perfil': 'profile',
        'registration': 'register',
        'sobre': 'about',
        'contato': 'contact',
        'relatorio-de-testes': 'tests',
        'entrar': 'login',
        'reset-password': 'resetPassword',
        'conversor-moedas': 'currencyConverter',
        'esqueceu': 'remember'
      };
      pageKey = keyMap[pageKey] || pageKey;
    }
    document.title = i18n.getTranslation(`pages.${pageKey}`);
  }

  async _loadRoute(path) {
    // Evita múltiplas chamadas simultâneas
    if (this.isLoading) {
      return;
    }

    // Se o path começar com /codigo-fonte/, permite a navegação normal
    if (path.startsWith('/codigo-fonte/')) {
      return;
    }

    this.isLoading = true;
    const view = this.shadowRoot.getElementById('view');

    // Limpa todo o conteúdo anterior
    view.innerHTML = '';

    try {
      const routePath = path || '/';
      // Separa o path base dos parâmetros
      const [basePath, searchParams] = routePath.split('?');
      const route = this.routes[basePath] || this.routes['/404'];
      const routeComponent = typeof route === 'string' ? route : route?.component;
      const isProtected = typeof route === 'object' ? route?.protected === true : false;
      const isAuth = await authService.isAuthenticated();

      // Verifica se é a página 404
      const is404Page = basePath === '/404' || route === this.routes['/404'];

      // Preserva os parâmetros da URL
      if (searchParams) {
        history.replaceState(null, '', basePath + '?' + searchParams);
      }

      // Atualiza o título da página
      this._updatePageTitle(path);

      // Define se deve mostrar o header
      let showHeader = true;
      if (is404Page && !isAuth) {
        showHeader = false;
      } else if (typeof route === 'object') {
        showHeader = route?.showHeader !== false;
      }

      // Se for uma rota protegida e não estiver autenticado, redireciona para login
      if (isProtected && !isAuth) {
        toast.warning('Você precisa estar logado para acessar esta página.');
        history.pushState(null, '', '/login');
        this.isLoading = false;
        await this._loadRoute('/login');
        return;
      }

      // Se estiver autenticado e tentar acessar login/registro, redireciona para home
      if (isAuth && (basePath === '/login' || basePath === '/registration' || basePath === '/esqueceu')) {
        history.pushState(null, '', '/');
        this.isLoading = false;
        await this._loadRoute('/');
        return;
      }

      // Lazy load do módulo da rota, se necessário
      if (typeof route === 'object' && typeof route.load === 'function') {
        try {
          await route.load();
        } catch (error) {
          console.error('Erro ao fazer lazy load da rota:', error);
          const fallbackRoute = this.routes['/404'];
          if (fallbackRoute?.load) {
            await fallbackRoute.load();
            // Se for fallback para 404 e não estiver autenticado, não mostra o header
            if (!isAuth) {
              showHeader = false;
            }
          }
        }
      }

      // Remove o header existente antes de qualquer decisão
      const existingHeader = this.shadowRoot.querySelector('app-header');
      if (existingHeader) {
        existingHeader.remove();
      }

      // Adiciona o header apenas se showHeader for true
      if (showHeader) {
        const header = document.createElement('app-header');
        this.shadowRoot.insertBefore(header, view);
      }

      if (routeComponent) {
        // Verifica se o componente está registrado
        if (!customElements.get(routeComponent)) {
          console.error(`Componente ${routeComponent} não está registrado`);
          view.innerHTML = `<h1>Erro ao carregar a página</h1>`;
          return;
        }

        try {
          // Cria o elemento usando innerHTML primeiro
          view.innerHTML = `<${routeComponent}></${routeComponent}>`;
          const element = view.firstElementChild;

          // Se o elemento foi criado com sucesso, adiciona ao DOM
          if (element) {
            element.classList.add('page-transition');
            view.appendChild(element);
          } else {
            throw new Error('Falha ao criar elemento');
          }
        } catch (error) {
          console.error('Erro ao criar elemento:', error);
          view.innerHTML = `<h1>Erro ao carregar a página</h1>`;
        }
      } else {
        view.innerHTML = `<h1>Rota não encontrada</h1>`;
      }

      this._updatePadding(navbarStore.collapsed);
    } finally {
      this.isLoading = false;
    }
  }
}

if (!customElements.get('app-router')) {
  customElements.define('app-router', AppRouter);
}

export default AppRouter;
