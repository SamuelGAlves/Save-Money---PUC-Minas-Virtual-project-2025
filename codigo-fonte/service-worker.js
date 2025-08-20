const CACHE_NAME = 'save-money-cache-v1';

// Função para verificar estado da conexão
async function checkConnection() {
  try {
    const response = await fetch('./robots.txt', { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.log('[SW] Modo offline detectado');
    return false;
  }
}

// Função para listar arquivos em cache
async function listCachedFiles() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  console.log('[SW] Arquivos em cache:');
  requests.forEach((request) => {
    console.log(`[SW] - ${request.url}`);
  });
  return requests;
}

// Função para criar resposta HTML com lista de arquivos em cache
async function createCacheListResponse() {
  const files = await listCachedFiles();
  const isOnline = await checkConnection();
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Arquivos em Cache</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          ul { list-style: none; padding: 0; }
          li { padding: 5px; border-bottom: 1px solid #eee; }
          .status { color: #666; font-size: 0.9em; }
          .online { color: green; }
          .offline { color: red; }
        </style>
      </head>
      <body>
        <h1>Arquivos em Cache</h1>
        <p class="status">Total de arquivos: ${files.length}</p>
        <p class="status ${isOnline ? 'online' : 'offline'}">
          Status: ${isOnline ? 'Online' : 'Offline'}
        </p>
        <ul>
          ${files.map((file) => `<li>${file.url}</li>`).join('')}
        </ul>
      </body>
    </html>
  `;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

// Função para normalizar URLs
function normalizeUrl(path) {
  // Remove query strings e hashes
  const cleanPath = path.split('?')[0].split('#')[0];

  // Remove trailing slash
  const normalized = cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath;

  // Adiciona .html para arquivos que não têm extensão
  if (!normalized.includes('.')) {
    return `${normalized}.html`;
  }

  return normalized;
}

// Função para resolver URL relativa
function resolveUrl(baseUrl, relativeUrl) {
  try {
    // Se a URL já for absoluta, retorna ela mesma
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }

    // Se a URL começar com /, usa a origem como base
    if (relativeUrl.startsWith('/')) {
      return new URL(relativeUrl, self.location.origin).href;
    }

    // Para URLs relativas, usa a base fornecida
    return new URL(relativeUrl, baseUrl).href;
  } catch (error) {
    console.error('[SW] Erro ao resolver URL:', error);
    return relativeUrl;
  }
}

// Função para verificar se uma URL é uma rota do aplicativo
function isAppRoute(url) {
  try {
    const publicRoutes = [
      '/login',
      '/registration',
      '/esqueceu',
      '/reset-password',
      '/sobre',
      '/contato',
      '/404'
    ];

    const protectedRoutes = [
      '/',
      '/perfil',
      '/user-edit',
      '/investimentos',
      '/receitas',
      '/despesas',
      '/conversor-moedas',
      '/testes',
      '/relatorios'
    ];

    // Resolve a URL se for relativa
    const resolvedUrl = resolveUrl(self.location.href, url);
    const path = new URL(resolvedUrl).pathname;

    // Verifica se é um recurso estático
    const isStaticResource = path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webmanifest)$/i);
    if (isStaticResource) {
      return false;
    }

    // Verifica se é uma rota do aplicativo (pública ou protegida)
    return [...publicRoutes, ...protectedRoutes].includes(path);
  } catch (error) {
    console.error('[SW] Erro ao verificar rota:', error);
    return false;
  }
}

// Função para verificar se uma URL é uma rota pública
function isPublicRoute(url) {
  try {
    const publicRoutes = [
      '/login',
      '/registration',
      '/esqueceu',
      '/reset-password',
      '/sobre',
      '/contato',
      '/404'
    ];

    // Resolve a URL se for relativa
    const resolvedUrl = resolveUrl(self.location.href, url);
    const path = new URL(resolvedUrl).pathname;
    return publicRoutes.includes(path);
  } catch (error) {
    console.error('[SW] Erro ao verificar rota pública:', error);
    return false;
  }
}

// Função para pré-carregar um arquivo
async function preloadFile(url) {
  try {
    // Resolve a URL se for relativa
    const resolvedUrl = resolveUrl(self.location.href, url);

    // Ignora rotas do aplicativo
    if (isAppRoute(resolvedUrl)) {
      console.log('[SW] Ignorando rota do aplicativo:', resolvedUrl);
      return true;
    }

    console.log('[SW] Tentando pré-carregar:', resolvedUrl);
    const response = await fetch(resolvedUrl, {
      credentials: 'same-origin',
      mode: 'same-origin',
      headers: {
        Accept: 'application/javascript, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Nonce': 'YWJjMTIzNDU2Nzg5',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cache = await caches.open(CACHE_NAME);
    const clonedResponse = response.clone();
    await cache.put(resolvedUrl, clonedResponse);
    console.log('[SW] Arquivo pré-carregado com sucesso:', resolvedUrl);
    return true;
  } catch (error) {
    console.error('[SW] Erro ao pré-carregar arquivo:', url, error);
    return false;
  }
}

// Arquivos críticos que devem ser carregados primeiro
const CRITICAL_FILES = [
  // Arquivos principais
  './index.html',
  './404.html',

  // Core
  './core/index.js',
  './core/components/index.js',
  './core/routes/index.js',

  // Utils
  './core/utils/date.js',
  './core/utils/currency.js',
  './core/utils/generate.js',
  './core/utils/validators.js',

  // Components Common
  './core/components/common/index.js',
  './core/components/common/logo.js',
  './core/components/common/darkmode.js',
  './core/components/common/page-header.js',
  './core/components/common/page-filter.js',
  './core/components/common/avatar.js',
  './core/components/common/icon.js',

  // Components Cards
  './core/components/cards/index.js',
  './core/components/cards/base-card.js',

  // Components Modals
  './core/components/modals/index.js',
  './core/components/modals/modal.js',
  './core/components/modals/totals-modal.js',
  './core/components/modals/recurring-modal.js',
  './core/components/modals/history-modal.js',
  './core/components/modals/logout.js',

  // Components Status
  './core/components/status/index.js',
  './core/components/status/toast.js',
  './core/components/status/loader.js',

  // Components Lists
  './core/components/lists/index.js',
  './core/components/lists/base-list.js',

  // Components Form
  './core/components/form/index.js',
  './core/components/form/input.js',
  './core/components/form/select.js',
  './core/components/form/checkbox.js',
  './core/components/form/button.js',
  './core/components/form/textarea.js',

  // Components Layout
  './core/components/layout/index.js',
  './core/components/layout/router.js',
  './core/components/layout/navbar.js',
  './core/components/layout/header.js',

  // Store
  './core/store/visibilityStore.js',
  './core/store/navbarStore.js',
  './core/store/investimentos.js',
  './core/store/receitas.js',
  './core/store/despesas.js',
  './core/store/homeTotalsStore.js',
  './core/store/totalsStore.js',

  // Services
  './core/services/toast.js',
  './core/services/secure-storage.js',
  './core/services/auth.js',
  './core/services/crypto.js',
  './core/services/loader.js',
  './core/services/exchangeRate.js',

  // Páginas do Core
  './core/pages/notfound.js',

  // Profile
  './core/pages/profile/page.js',
  './core/pages/profile/modais/confirm.js',

  // Home
  './core/pages/home/page.js',
  './core/pages/home/components/recurring-info.js',
  './core/pages/home/components/total-card.js',

  // Login
  './core/pages/login/page.js',
  './core/pages/login/content.js',
  './core/pages/login/imagens/hero-image-BRL.jpg',
  './core/pages/login/imagens/hero-image-CNY.jpg',
  './core/pages/login/imagens/hero-image-INR.jpg',
  './core/pages/login/imagens/hero-image-RUB.jpg',
  './core/pages/login/imagens/hero-image-EUR.jpg',
  './core/pages/login/imagens/hero-image-USD.jpg',
  './core/pages/login/imagens/hero-image-ZAR.jpg',
  './core/pages/login/imagens/hero-image-AED.jpg',

  // Registration
  './core/pages/registration/page.js',
  './core/pages/registration/content.js',
  './core/pages/registration/imagens/hero-image.jpg',

  // User Edit
  './core/pages/user-edit/page.js',

  // Remember
  './core/pages/remember/page.js',
  './core/pages/remember/content.js',
  './core/pages/remember/imagens/hero-image.jpg',

  // Investimentos
  './core/pages/investimentos/page.js',
  './core/pages/investimentos/components/header.js',
  './core/pages/investimentos/components/list.js',
  './core/pages/investimentos/components/filter.js',
  './core/pages/investimentos/components/card.js',
  './core/pages/investimentos/modais/confirm.js',
  './core/pages/investimentos/modais/create-update.js',

  // Receitas
  './core/pages/receitas/page.js',
  './core/pages/receitas/components/header.js',
  './core/pages/receitas/components/list.js',
  './core/pages/receitas/components/filter.js',
  './core/pages/receitas/components/card.js',
  './core/pages/receitas/modais/confirm.js',
  './core/pages/receitas/modais/create-update.js',

  // Despesas
  './core/pages/despesas/page.js',
  './core/pages/despesas/components/header.js',
  './core/pages/despesas/components/list.js',
  './core/pages/despesas/components/filter.js',
  './core/pages/despesas/components/card.js',
  './core/pages/despesas/modais/confirm.js',
  './core/pages/despesas/modais/create-update.js',

  // Conversor de Moedas
  './core/pages/conversor-moedas/page.js',
  './core/pages/conversor-moedas/components/currency-converter.js',

  // i18n
  './core/i18n/i18n.js',
  './core/i18n/translations/ar-sa/translate.json',
  './core/i18n/translations/en-us/translate.json',
  './core/i18n/translations/es-es/translate.json',
  './core/i18n/translations/fr-fr/translate.json',
  './core/i18n/translations/hi-in/translate.json',
  './core/i18n/translations/pt-br/translate.json',
  './core/i18n/translations/ru-ru/translate.json',
  './core/i18n/translations/zh-cn/translate.json',
  './core/i18n/translations/zu-za/translate.json',

  // Assets
  './assets/favicon.ico',
  './assets/favicon-96x96.png',
  './assets/favicon.svg',
  './assets/apple-touch-icon.png',
  './assets/site.webmanifest',
  './assets/web-app-manifest-192x192.png',
  './assets/web-app-manifest-512x512.png',

  // Relatórios
  './core/pages/reports/page.js',
].map(normalizeUrl);

// Lista de URLs para cache
const urlsToCache = [
  // Adiciona todos os arquivos críticos
  ...CRITICAL_FILES,

  './robots.txt',
].map(normalizeUrl);

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[SW] Abrindo cache e adicionando arquivos...');

      // Primeiro carrega os arquivos críticos
      console.log('[SW] Carregando arquivos críticos...');
      for (const url of CRITICAL_FILES) {
        let success = false;
        let attempts = 0;
        const maxAttempts = 3;

        while (!success && attempts < maxAttempts) {
          success = await preloadFile(url);
          if (!success) {
            attempts++;
            console.log(`[SW] Tentativa ${attempts} de ${maxAttempts} para carregar:`, url);
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
          }
        }

        if (!success) {
          console.error('[SW] Falha ao carregar arquivo crítico após todas as tentativas:', url);
        }
      }

      // Depois carrega o resto dos arquivos
      console.log('[SW] Carregando arquivos não críticos...');
      for (const url of urlsToCache) {
        if (!CRITICAL_FILES.includes(url)) {
          try {
            console.log('[SW] Tentando buscar:', url);
            const response = await fetch(url, {
              credentials: 'same-origin',
              mode: 'same-origin',
            });

            if (!response.ok) {
              throw new Error(`Erro ${response.status} ao buscar ${url}`);
            }

            const clonedResponse = response.clone();
            await cache.put(url, clonedResponse);
            console.log('[SW] Adicionado ao cache com sucesso:', url);
          } catch (err) {
            console.warn('[SW] Falha ao buscar e cachear:', url, err.message);
          }
        }
      }

      // Lista os arquivos após a instalação
      await listCachedFiles();
    })()
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            await caches.delete(cacheName);
          }
        })
      );

      // Lista os arquivos após a ativação
      await listCachedFiles();
    })()
  );
});

// Interceptação de requisições
self.addEventListener('fetch', async (event) => {
  const url = new URL(event.request.url);

  // Ignora requisições para outros domínios
  if (url.origin !== self.location.origin) {
    console.log('[SW] Ignorando fetch para outro domínio:', url.href);
    return;
  }

  // Ignora requisições POST
  if (event.request.method !== 'GET') {
    console.log('[SW] Ignorando requisição não-GET:', event.request.method);
    return;
  }

  const normalizedUrl = normalizeUrl(url.pathname);
  console.log('[SW] Requisição recebida:', normalizedUrl);

  // Endpoint para listar arquivos em cache
  if (normalizedUrl === './cache-status') {
    event.respondWith(createCacheListResponse());
    return;
  }

  // Ignorar o próprio service worker para evitar loops/falhas
  if (normalizedUrl.includes('service-worker.js')) {
    console.log('[SW] Ignorando requisição do próprio service worker');
    return;
  }

  // Ignorar requisições WebSocket
  if (url.protocol === 'ws:' || url.protocol === 'wss:') {
    console.log('[SW] Ignorando requisição WebSocket');
    return;
  }

  // Verifica se é uma rota do aplicativo
  if (isAppRoute(url.href)) {
    console.log('[SW] Ignorando fetch para rota do aplicativo:', url.href);
    return;
  }

  // Tenta buscar do cache primeiro
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(normalizedUrl);

  if (cachedResponse) {
    console.log('[SW] Recurso encontrado no cache:', normalizedUrl);
    event.respondWith(cachedResponse);
    return;
  }

  // Se não estiver no cache, tenta buscar da rede
  try {
    const response = await fetch(event.request);
    if (response.ok) {
      const clonedResponse = response.clone();
      await cache.put(normalizedUrl, clonedResponse);
      console.log('[SW] Recurso adicionado ao cache:', normalizedUrl);
      event.respondWith(response);
    } else {
      console.log('[SW] Recurso não encontrado:', normalizedUrl);
      event.respondWith(new Response('Not Found', { status: 404 }));
    }
  } catch (error) {
    console.error('[SW] Erro ao buscar recurso:', normalizedUrl, error);
    event.respondWith(new Response('Network Error', { status: 500 }));
  }
});
