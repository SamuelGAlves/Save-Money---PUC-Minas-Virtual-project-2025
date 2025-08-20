import authService from '../../services/auth.js';
import toast from '../../services/toast.js';
import { loaderService } from '../../services/loader.js';
import { i18n } from '../../i18n/i18n.js';
import { validarSenha } from '../../utils/validators.js';
import secureStorage from '../../services/secure-storage.js';

class ResetPasswordContent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.init();
    i18n.addObserver(() => this.init());
  }

  init() {
    this.render();
    if (window.location.pathname === '/reset-password') {
      this.validateToken();
    }
    this.setupEventListeners();
  }

  disconnectedCallback() {
    i18n.removeObserver(() => this.render());
  }

  setupEventListeners() {
    const resetButton = this.shadowRoot.getElementById('reset-button');
    const tokenInput = this.shadowRoot.getElementById('token');

    resetButton?.addEventListener('click', () => this.handleReset());
    tokenInput?.addEventListener('input', () => tokenInput.clearError());
  }

  async validateToken() {
    const hash = window.location.hash;
    const token = hash.split('?')[1]?.split('=')[1];

    if (!token) {
      toast.error(i18n.getTranslation('reset-password.invalidToken'));
      setTimeout(() => {
        history.pushState(null, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 3000);
      return;
    }

    const storedTokenData = await secureStorage.getItem(localStorage, 'recovery_token');
    if (!storedTokenData) {
      toast.error(i18n.getTranslation('reset-password.tokenExpired'));
      setTimeout(() => {
        history.pushState(null, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 3000);
      return;
    }

    const { token: storedToken, expires } = JSON.parse(storedTokenData);
    if (token !== storedToken || Date.now() > expires) {
      toast.error(i18n.getTranslation('reset-password.tokenExpired'));
      await secureStorage.removeItem(localStorage, 'recovery_token');
      setTimeout(() => {
        history.pushState(null, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 3000);
      return;
    }
  }

  setError(input, message) {
    if (input && typeof input.setError === 'function') {
      input.setError(message);
    }
  }

  clearErrors() {
    const passwordInput = this.shadowRoot.getElementById('password');
    const confirmPasswordInput = this.shadowRoot.getElementById('confirm-password');
    const tokenInput = this.shadowRoot.getElementById('token');
    passwordInput?.clearError();
    confirmPasswordInput?.clearError();
    tokenInput?.clearError();
  }

  validateFields(password, confirmPassword, passwordInput, confirmPasswordInput) {
    let isValid = true;

    if (!password) {
      this.setError(passwordInput, i18n.getTranslation('registration.password.required'));
      isValid = false;
    } else if (!validarSenha(password)) {
      this.setError(passwordInput, i18n.getTranslation('registration.password.invalid'));
      toast.error(i18n.getTranslation('registration.password.invalid'));
      isValid = false;
    }

    if (!confirmPassword) {
      this.setError(confirmPasswordInput, i18n.getTranslation('registration.confirmPassword.required'));
      isValid = false;
    } else if (password !== confirmPassword) {
      this.setError(confirmPasswordInput, i18n.getTranslation('registration.confirmPassword.mismatch'));
      toast.error(i18n.getTranslation('registration.confirmPassword.mismatch'));
      isValid = false;
    }

    return isValid;
  }

  async handleReset() {
    const passwordInput = this.shadowRoot.getElementById('password');
    const confirmPasswordInput = this.shadowRoot.getElementById('confirm-password');
    const tokenInput = this.shadowRoot.getElementById('token');
    const password = passwordInput?.shadowRoot.querySelector('input')?.value;
    const confirmPassword = confirmPasswordInput?.shadowRoot.querySelector('input')?.value;
    const token = tokenInput?.shadowRoot.querySelector('input')?.value.trim();

    this.clearErrors();

    if (!token) {
      this.setError(tokenInput, i18n.getTranslation('reset-password.token.required'));
      return;
    }

    if (!this.validateFields(password, confirmPassword, passwordInput, confirmPasswordInput)) {
      return;
    }

    try {
      loaderService.show(i18n.getTranslation('reset-password.loading'));

      const success = await authService.resetPassword(token, password);

      if (success) {
        await secureStorage.removeItem(localStorage, 'recovery_token');
        toast.success(i18n.getTranslation('reset-password.success'));
        setTimeout(() => {
          history.pushState(null, '', '/login');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }, 2000);
      } else {
        toast.error(i18n.getTranslation('reset-password.error'));
      }
    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      toast.error(i18n.getTranslation('reset-password.error'));
    } finally {
      loaderService.hide();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        section.reset-password-content {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          color: var(--color-text);
          max-width: 400px;
          width: 100%;
          margin: auto;
          h1 {
            margin-top: 0;
          }
        }

        app-button:last-of-type {
          margin-top: 1rem;
        }
      </style>
      <section class="reset-password-content">
        <h1>${i18n.getTranslation('reset-password.title')}</h1>

        <app-input
          type="text"
          placeholder="${i18n.getTranslation('reset-password.token.placeholder')}"
          label="${i18n.getTranslation('reset-password.token.label')}"
          id="token"
          required
        ></app-input>
        <app-input
          type="password"
          placeholder="${i18n.getTranslation('reset-password.password.placeholder')}"
          label="${i18n.getTranslation('reset-password.password.label')}"
          id="password"
          required
        ></app-input>
        <app-input
          type="password"
          placeholder="${i18n.getTranslation('reset-password.confirmPassword.placeholder')}"
          label="${i18n.getTranslation('reset-password.confirmPassword.label')}"
          id="confirm-password"
          required
        ></app-input>
        <app-button
          id="reset-button"
          fullWidth="true"
        >
          <app-icon>check</app-icon>
          ${i18n.getTranslation('reset-password.button')}
        </app-button>
      </section>
    `;
  }
}

customElements.define('reset-password-content', ResetPasswordContent);
