import authService from '../../services/auth.js';
import toast from '../../services/toast.js';
import { loaderService } from '../../services/loader.js';
import { i18n } from '../../i18n/i18n.js';

class LoginContent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.init();

    // Observa mudanças no idioma
    i18n.addObserver(() => this.init());
  }

  init() {
    this.render();

    this.shadowRoot
      .getElementById('login-button')
      .addEventListener('click', () => this.handleLogin());

    this.shadowRoot
      .querySelector('form.login-content')
      .addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });

    // Adiciona listeners para limpar erros ao modificar os campos
    const emailInput = this.shadowRoot.getElementById('email');
    const passwordInput = this.shadowRoot.getElementById('password');

    emailInput?.addEventListener('input', () => emailInput.clearError());
    passwordInput?.addEventListener('input', () => passwordInput.clearError());

    // Adiciona listener para fazer login ao pressionar Enter na senha
    passwordInput?.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.handleLogin();
      }
    });
  }

  disconnectedCallback() {
    i18n.removeObserver(() => this.render());
  }

  setError(input, message) {
    if (input && typeof input.setError === 'function') {
      input.setError(message);
    }
  }

  clearErrors() {
    const emailInput = this.shadowRoot.getElementById('email');
    const passwordInput = this.shadowRoot.getElementById('password');

    emailInput?.clearError();
    passwordInput?.clearError();
  }

  validateFields(email, password, emailInput, passwordInput) {
    let isValid = true;

    if (!email) {
      this.setError(emailInput, i18n.getTranslation('login.email.required'));
      isValid = false;
    }

    if (!password) {
      this.setError(passwordInput, i18n.getTranslation('login.password.required'));
      isValid = false;
    }

    return isValid;
  }

  async handleLogin() {
    const emailInput = this.shadowRoot.getElementById('email');
    const passwordInput = this.shadowRoot.getElementById('password');

    const email = emailInput?.shadowRoot.querySelector('input')?.value.trim();
    const password = passwordInput?.shadowRoot.querySelector('input')?.value;

    this.clearErrors();

    if (!this.validateFields(email, password, emailInput, passwordInput)) {
      toast.error(i18n.getTranslation('login.fillFields'));
      return;
    }

    try {
      loaderService.show(i18n.getTranslation('login.loading'));

      // Adiciona um delay mínimo de 1.5 segundos para melhor UX
      const [result] = await Promise.all([
        authService.login(email, password),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);

      if (result.success) {
        toast.success(i18n.getTranslation('login.success'));
        history.pushState(null, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error('Erro ao tentar login:', err);
      toast.error(i18n.getTranslation('login.error'));
    } finally {
      loaderService.hide();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        form.login-content {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          color: var(--color-text);
          width: 100%;
          max-width: 400px;
          margin: auto;
          h1 {
            margin-top: 0;
          }
        }
        a {
          color: var(--color-primary);
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        a:visited {
          color: var(--color-secondary);
        }
      </style>
      <form class="login-content">
        <dark-mode-toggle type="fixed"></dark-mode-toggle>
        <h1>${i18n.getTranslation('login.title')}</h1>
        <app-input
          type="text"
          placeholder="${i18n.getTranslation('login.email.placeholder')}"
          label="${i18n.getTranslation('login.email.label')}"
          id="email"
          required
          maxlength="60"
          minlength="5"
          autocomplete="email"
        ></app-input>
        <app-input
          type="password"
          placeholder="${i18n.getTranslation('login.password.placeholder')}"
          label="${i18n.getTranslation('login.password.label')}"
          id="password"
          required
          autocomplete="current-password"
        ></app-input>
        <app-button
          id="login-button"
          fullWidth="true"
          type="submit"
        ><app-icon>login</app-icon>${i18n.getTranslation('login.button')}</app-button>
        <p>${i18n.getTranslation('login.forgotPassword')} <app-link href="/esqueceu">${i18n.getTranslation('login.forgotPasswordLink')}</app-link></p>
        <app-button
          href="/registration"
          fullWidth="true"
          variant="secondary"
          type="button"
        ><app-icon>person_add</app-icon>${i18n.getTranslation('login.register')}</app-button>
      </form>
    `;
  }
}

// Registra o componente antes de exportá-lo
customElements.define('login-content', LoginContent);

export default LoginContent;
