# Guia de Estilo de Código - Save Money

**Objetivo:** Fornecer convenções de estilo de código para o desenvolvimento do Save Money, uma aplicação web SPA (Single Page Application) para gestão financeira.

## 1. Estrutura do Projeto

```
📁 docs/
├── core/                      # Núcleo da aplicação SPA
│   ├── components/            # Componentes reutilizáveis
│   │   ├── common/            # Componentes comuns
│   │   │   ├── avatar.js      # Componente de avatar
│   │   │   ├── button.js      # Componente de botão
│   │   │   ├── darkmode.js    # Componente de tema escuro
│   │   │   ├── icon.js        # Componente de ícone
│   │   │   ├── input.js       # Componente de input
│   │   │   ├── logo.js        # Componente de logo
│   │   │   ├── modal.js       # Componente de modal
│   │   │   └── toast.js       # Componente de notificação
│   │   └── layout/            # Componentes de layout
│   │       ├── header.js      # Componente de cabeçalho
│   │       ├── navbar.js      # Componente de navegação
│   │       └── router.js      # Componente de roteamento
│   ├── pages/                 # Páginas da aplicação
│   │   ├── home/              # Página inicial
│   │   ├── login/             # Página de login
│   │   ├── registration/      # Página de registro
│   │   ├── investimentos/     # Página de investimentos
│   │   ├── profile/           # Página de perfil
│   │   ├── remember/          # Página de recuperação
│   │   ├── user-edit/         # Página de edição de usuário
│   │   ├── testes/            # Páginas de teste
│   │   └── notfound.js        # Página 404
│   ├── services/              # Serviços e APIs
│   │   ├── auth.js            # Serviço de autenticação
│   │   ├── crypto.js          # Serviço de criptografia
│   │   ├── secure-storage.js  # Serviço de armazenamento seguro
│   │   └── toast.js           # Serviço de notificações
│   ├── store/                 # Gerenciamento de estado
│   │   ├── investimentos.js   # Store de investimentos
│   │   ├── navbarStore.js     # Store da navegação
│   │   └── visibilityStore.js # Store de visibilidade
│   ├── utils/                 # Funções utilitárias
│   │   ├── currency.js        # Utilitários de moeda
│   │   ├── date.js            # Utilitários de data
│   │   └── route.js           # Utilitários de rota
│   ├── index.js               # Ponto de entrada
│   └── initPageExternal.js    # Inicialização externa
├── assets/                    # Recursos estáticos
├── styles/                    # Arquivos CSS
│   ├── global.css             # Estilos globais e variáveis CSS
│   └── reset.css              # Reset de estilos padrão
└── index.html                 # Página principal
```

## 2. JavaScript

### 2.2 Componentes

✅ Web Components com Shadow DOM:

```javascript
// Exemplo de componente com Shadow DOM
export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        /* Estilos encapsulados */
      </style>
      <div class="component-container">
        <!-- Template do componente -->
      </div>
    `;
  }
}
```

### 2.3 Rotas

✅ Sistema de rotas com hash e lazy loading:

```javascript
// core/routes/index.js
export const routes = {
  '#/': {
    component: 'home-page',
    showHeader: true,
    protected: true,
    load: () => import('../pages/home/page.js'),
  },
  '#/login': {
    component: 'login-page',
    showHeader: false,
    load: () => import('../pages/login/page.js'),
  },
  '#/investimentos': {
    component: 'investments-page',
    showHeader: true,
    protected: true,
    load: () => import('../pages/investimentos/page.js'),
  }
};
```

### 2.4 Componentes Existentes

#### Layout Components
- `app-header`: Cabeçalho da aplicação
- `app-navbar`: Barra de navegação
- `app-router`: Gerenciador de rotas

#### Common Components
- `app-avatar`: Componente de avatar do usuário
- `app-button`: Botão personalizado
- `app-darkmode`: Controle de tema escuro
- `app-icon`: Componente de ícones
- `app-input`: Campo de entrada
- `app-logo`: Logo da aplicação
- `app-modal`: Modal para diálogos
- `app-toast`: Notificações toast

#### Pages
- `home-page`: Página inicial
- `login-page`: Página de login
- `registration-page`: Página de registro
- `investments-page`: Página de investimentos
- `profile-page`: Página de perfil
- `not-found-page`: Página 404

## 3. CSS em Web Components

### 3.1 Estilos Globais e Temas

O projeto utiliza dois arquivos principais para estilos:

#### 3.1.1 reset.css
- Remove estilos padrão do navegador
- Normaliza o comportamento entre diferentes navegadores
- Define valores base para elementos HTML

#### 3.1.2 global.css
Contém as variáveis CSS para suporte a temas light e dark mode:

```css
/* Light Mode */
body.light-mode {
  /* Cores básicas */
  --color-primary: #0056b3;
  --color-secondary: #28a745;
  --color-background: #f8f9fa;
  --color-text: #333;
  /* ... outras cores ... */

  /* Gradientes */
  --gradient-primary: linear-gradient(90deg, #add8b5 0%, #5b725f 100%);
  --gradient-secondary: linear-gradient(90deg, #e0e0e0 0%, #b0b0b0 100%);
  /* ... outros gradientes ... */

  /* Componentes */
  --button-primary-bg: var(--gradient-primary);
  --button-primary-text-color: var(--color-white);
  --input-background-color: var(--color-white);
  --input-text-color: var(--color-black);
  /* ... outras variáveis de componentes ... */
}

/* Dark Mode */
body.dark-mode {
  /* Cores básicas */
  --color-primary: #4dabf7;
  --color-secondary: #51cf66;
  --color-background: #121212;
  --color-text: #f1f3f5;
  /* ... outras cores ... */

  /* Gradientes */
  --gradient-primary: linear-gradient(90deg, #3a765a 0%, #1f4037 100%);
  --gradient-secondary: linear-gradient(90deg, #495057 0%, #343a40 100%);
  /* ... outros gradientes ... */

  /* Componentes */
  --button-primary-bg: var(--gradient-primary);
  --button-primary-text-color: var(--color-white);
  --input-background-color: #1e1e1e;
  --input-text-color: var(--color-white);
  /* ... outras variáveis de componentes ... */
}
```

As variáveis CSS são organizadas em categorias:
1. **Cores básicas**: Definições de cores primárias, secundárias e estados
2. **Gradientes**: Combinações de cores para efeitos visuais
3. **Backgrounds**: Cores de fundo para diferentes contextos
4. **Text Colors**: Cores para textos e estados
5. **Componentes**: Variáveis específicas para cada componente:
   - Header
   - InvestmentCard
   - Toast
   - Input
   - Button
   - Logo
   - Navbar

Para usar as variáveis em componentes:

```javascript
class CustomComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .container {
          background: var(--background-card-color);
          color: var(--text-color);
          padding: 1rem;
          border-radius: var(--button-border-radius);
          box-shadow: var(--header-box-shadow);
        }

        .button {
          background: var(--button-primary-bg);
          color: var(--button-primary-text-color);
          border: var(--button-primary-border);
          border-radius: var(--button-border-radius);
          padding: var(--button-md-padding);
          font-size: var(--button-md-font-size);
        }

        .button:hover {
          background: var(--button-primary-hover-bg);
        }

        .input {
          background: var(--input-background-color);
          color: var(--input-text-color);
          border: 1px solid var(--input-border-color);
        }

        .input:disabled {
          background: var(--input-disabled-background-color);
          color: var(--input-disabled-text-color);
          border-color: var(--input-disabled-border-color);
        }
      </style>
      <div class="container">
        <input class="input" type="text">
        <button class="button">Clique aqui</button>
      </div>
    `;
  }
}
```

## 4. Boas Práticas

### 4.1 Arquitetura SPA
- Componentes independentes
- Roteamento client-side
- Lazy loading de módulos

### 4.2 Performance
- Code splitting
- Lazy loading de rotas
- Otimização de assets
- Cache de componentes

### 4.3 Manutenibilidade
- Código modular
- Padrão de projeto consistente
- Documentação de componentes

### 4.4 Acessibilidade
- ARIA labels
- Navegação por teclado
- Contraste adequado
- Feedback visual

## 5. Convenções de Nomenclatura

### 5.1 Web Components

✅ Padrão de nomenclatura para componentes:
- Prefixo `app-` para todos os componentes
- Nome em kebab-case
- Sufixo indicando o tipo de componente

```javascript
// Componentes comuns
customElements.define('app-button', ButtonComponent);
customElements.define('app-input', InputComponent);
customElements.define('app-toast', ToastComponent);

// Componentes de layout
customElements.define('app-header', HeaderComponent);
customElements.define('app-navbar', NavbarComponent);
customElements.define('app-router', RouterComponent);

// Páginas
customElements.define('home-page', HomePage);
customElements.define('login-page', LoginPage);
customElements.define('investments-page', InvestmentsPage);
```

### 5.2 Variáveis CSS

✅ Padrão de nomenclatura para variáveis CSS:
- Prefixo `--` para todas as variáveis
- Agrupamento por contexto
- Nomes descritivos em kebab-case

```css
/* Cores básicas */
--color-primary
--color-secondary
--color-background

/* Componentes */
--button-primary-bg
--button-primary-text-color
--input-background-color
--input-text-color

/* Estados */
--button-hover-bg
--input-disabled-bg
--toast-error-bg
```

### 5.3 Rotas

✅ Padrão de nomenclatura para rotas:
- Uso de hash (#) para navegação
- Nomes em português para rotas públicas
- Estrutura clara e hierárquica

```javascript
const routes = {
  '#/': {
    component: 'home-page',
    showHeader: true,
    protected: true
  },
  '#/login': {
    component: 'login-page',
    showHeader: false
  },
  '#/investimentos': {
    component: 'investments-page',
    showHeader: true,
    protected: true
  }
};
```

### 5.4 Páginas

✅ Padrão de nomenclatura para páginas:
- Sufixo `-page` para componentes de página
- Nomes em inglês para arquivos
- Estrutura de diretórios organizada

```
pages/
├── home/              # Página inicial
│   ├── page.js       # Componente principal
│   └── styles.css    # Estilos específicos
├── login/            # Página de login
│   ├── page.js
│   └── styles.css
└── investimentos/    # Página de investimentos
    ├── page.js
    └── styles.css
```

### 5.5 Arquivos JavaScript

✅ Padrão de nomenclatura para arquivos:
- Nomes em camelCase
- Sufixo indicando o tipo de arquivo
- Nomes descritivos e concisos

```
services/
├── auth.js           # Serviço de autenticação
├── crypto.js         # Serviço de criptografia
└── secure-storage.js # Serviço de armazenamento

utils/
├── currency.js       # Utilitários de moeda
├── date.js          # Utilitários de data
└── route.js         # Utilitários de rota
```

### 5.6 Classes e Métodos

✅ Padrão de nomenclatura para classes e métodos:
- Classes em PascalCase
- Métodos em camelCase
- Nomes descritivos e em inglês

```javascript
class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    // Implementação do render
  }

  setupEventListeners() {
    // Configuração de eventos
  }
}
```
