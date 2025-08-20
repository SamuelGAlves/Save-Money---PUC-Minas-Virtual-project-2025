// Importando as páginas
export const routes = {
  '/': {
    component: 'home-page',
    showHeader: true,
    protected: true,
    load: () => import('../pages/home/page.js'),
  },
  '/sobre': {
    component: 'about-page',
    showHeader: true,
    load: () => import('../pages/about/page.js'),
  },
  '/contato': {
    component: 'contact-page',
    showHeader: true,
    load: () => import('../pages/contact/page.js'),
  },
  '/perfil': {
    component: 'profile-page',
    showHeader: true,
    protected: true,
    load: () => import('../../core/pages/profile/page.js'),
  },
  '/user-edit': {
    component: 'user-edit-page',
    showHeader: true,
    protected: true,
    load: () => import('../../core/pages/user-edit/page.js'),
  },
  '/login': {
    component: 'login-page',
    showHeader: false,
    load: () => import('../../core/pages/login/page.js'),
  },
  '/registration': {
    component: 'registration-page',
    showHeader: false,
    load: () => import('../../core/pages/registration/page.js'),
  },
  '/esqueceu': {
    component: 'remember-page',
    showHeader: false,
    load: () => import('../../core/pages/remember/page.js'),
  },
  '/reset-password': {
    component: 'reset-password-page',
    showHeader: false,
    load: () => import('../../core/pages/reset-password/page.js'),
  },
  '/receitas': {
    component: 'receitas-page',
    showHeader: true,
    protected: true,
    load: () => import('../../core/pages/receitas/page.js'),
  },
  '/despesas': {
    component: 'despesas-page',
    showHeader: true,
    protected: true,
    load: () => import('../../core/pages/despesas/page.js'),
  },
  '/investimentos': {
    component: 'investments-page',
    showHeader: true,
    protected: true,
    load: () => import('../../core/pages/investimentos/page.js'),
  },
  '/conversor-moedas': {
    component: 'conversor-moedas-page',
    showHeader: true,
    load: () => import('../../core/pages/conversor-moedas/page.js'),
  },
  '/testes': {
    component: 'testes-page',
    showHeader: true,
    load: () => import('../../core/pages/testes/page.js'),
  },
  '/relatorios': {
    component: 'reports-page',
    showHeader: true,
    protected: true,
    load: () => import('../../core/pages/reports/page.js'),
  },
  '/404': {
    component: 'not-found-page',
    showHeader: true,
    load: () => import('../../core/pages/notfound.js'),
  },
};

export const initializeRouter = (router) => {
  if (router) {
    router.config = routes;
  } else {
    console.error('Componente app-router não encontrado.');
  }
};
