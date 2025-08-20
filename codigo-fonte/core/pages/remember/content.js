import authService from '../../services/auth.js';
import toast from '../../services/toast.js';
import { loaderService } from '../../services/loader.js';
import { i18n } from '../../i18n/i18n.js';
import { validarEmail } from '../../utils/validators.js';
import secureStorage from '../../services/secure-storage.js';

class RememberContent extends HTMLElement {
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

    this.shadowRoot
      .getElementById('recover-button')
      .addEventListener('click', () => this.handleRecover());

    // Adiciona listener para limpar erros ao modificar o campo
    const emailInput = this.shadowRoot.getElementById('email');
    emailInput?.addEventListener('input', () => emailInput.clearError());
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
    emailInput?.clearError();
  }

  setInputValue(selector, value) {
    const inputComponent = this.shadowRoot.querySelector(selector);
    if (inputComponent) {
      inputComponent.value = value;
    }
  }

  validateFields(email, emailInput) {
    let isValid = true;

    if (!email) {
      this.setError(emailInput, i18n.getTranslation('remember.email.required'));
      isValid = false;
    } else if (!validarEmail(email)) {
      this.setError(emailInput, i18n.getTranslation('registration.email.invalid'));
      toast.error(i18n.getTranslation('registration.email.invalid'));
      isValid = false;
    }

    return isValid;
  }

  async handleRecover() {
    const emailInput = this.shadowRoot.getElementById('email');
    const email = emailInput?.shadowRoot.querySelector('input')?.value.trim();

    this.clearErrors();

    if (!this.validateFields(email, emailInput)) {
      return;
    }

    try {
      // Mostra o loader enquanto envia
      loaderService.show(i18n.getTranslation('remember.loading'));

      // Busca o usuário pelo email
      const user = await authService.getUser(email);

      if (!user) {
        loaderService.hide();
        toast.error(i18n.getTranslation('remember.email.notFound'));
        return;
      }

      // Gera um token temporário para recuperação de senha
      const recoveryToken = await authService.generateRecoveryToken(user.id);

      if (!recoveryToken) {
        loaderService.hide();
        toast.error(i18n.getTranslation('remember.error'));
        return;
      }

      // Salva o token no localStorage com expiração de 1 hora
      const tokenData = {
        token: recoveryToken,
        expires: Date.now() + (60 * 60 * 1000) // 1 hora
      };
      await secureStorage.setItem(localStorage, 'recovery_token', JSON.stringify(tokenData));

      const response = await fetch('https://savemoney-api.onrender.com/recover-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://savemoney.app.br'
        },
        body: JSON.stringify({
          email,
          recoveryToken,
          name: user.nome,
          locale: i18n.currentLanguage
        }),
      });

      const result = await response.json();

      loaderService.hide();

      if (result.message && result.message.includes('sucesso')) {
        toast.success(i18n.getTranslation('remember.success'));
        this.setInputValue('#email', '');
      } else {
        toast.error(i18n.getTranslation('remember.error'));
      }
    } catch (err) {
      loaderService.hide();
      console.error('Erro ao enviar lembrete de senha:', err);
      toast.error(i18n.getTranslation('remember.error'));
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        section.remember-content {
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
      <section class="remember-content">
        <h1>${i18n.getTranslation('remember.title')}</h1>
        <app-input
          type="email"
          placeholder="${i18n.getTranslation('remember.email.placeholder')}"
          label="${i18n.getTranslation('remember.email.label')}"
          maxlength="60"
          minlength="5"
          id="email"
          required
          autocomplete="email"
        ></app-input>
        <app-button
          id="recover-button"
          fullWidth="true"
        >
          <app-icon>check</app-icon>
          ${i18n.getTranslation('remember.button')}
        </app-button>
      </section>
    `;
  }
}

if (!customElements.get('remember-content')) {
  customElements.define('remember-content', RememberContent);
}

export default RememberContent;
