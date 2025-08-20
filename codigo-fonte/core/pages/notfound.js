import authService from '../services/auth.js';
import { i18n } from '../i18n/i18n.js';

class NotFoundPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
    this.setupLanguageObserver();
  }

  setupLanguageObserver() {
    i18n.addObserver(() => {
      this.render();
    });
  }

  disconnectedCallback() {
    i18n.removeObserver(this.render);
  }

  async render() {
    const isAuth = await authService.isAuthenticated();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          width: 100%;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--text-color);
        }

        /* Estilos comuns */
        .container {
          padding: 2rem;
          border-radius: 1rem;
        }

        .page-title {
          font-size: 2rem;
          margin-bottom: 1rem;
          margin-top: 0;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        p {
          font-size: 1.2rem;
          margin: 0.5rem 0 1.5rem;
        }

        /* Estilos específicos para usuário não autenticado */
        .not-auth-container {
          min-height: 100vh;
          align-items: center;
          justify-content: center;
          background: var(--background-color);
          display: flex;
          flex-direction: column;
          margin: 0 auto;
        }

        .not-auth-content {
          padding: 3rem;
          border-radius: 1.5rem;
          background: var(--background-card-color);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 600px;
          width: 90%;
          margin: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .error-code {
          font-size: 8rem;
          font-weight: bold;
          color: var(--color-danger);
          margin: 0;
          line-height: 1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .description {
          font-size: 1.2rem;
          margin: 1.5rem 0;
          color: var(--text-muted-color);
          line-height: 1.6;
        }

        .actions {
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .icon-container {
          display: flex;
          justify-content: center;
        }

        .icon-container app-icon {
          font-size: 4rem;
          color: var(--color-danger);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(2); }
          100% { transform: scale(1); }
        }

        @media (max-width: 800px) {
          .page-title {
            font-size: 1.2rem;
          }

          p {
            font-size: 1rem;
          }

          .not-auth-content {
            padding: 2rem;
            margin: 1rem;
            width: calc(100% - 6rem);
          }

          .error-code {
            font-size: 6rem;
          }

          .page-title {
            font-size: 1.8rem;
          }

          .description {
            font-size: 1rem;
          }
        }
      </style>
      ${isAuth ? `
        <div class="container">
          <h1 class="page-title">
            <app-icon aria-hidden="true">receipt_long</app-icon>
            ${i18n.getTranslation('notFound.title')}
          </h1>
          <p>${i18n.getTranslation('notFound.description')}</p>
        </div>
      ` : `
        <div class="not-auth-container">
          <div>
            <save-money-logo size="large"></save-money-logo>
            <dark-mode-toggle type="fixed"></dark-mode-toggle>
          </div>
          <div class="not-auth-content">
            <div class="icon-container">
              <app-icon aria-hidden="true" size="large">error</app-icon>
            </div>
            <div class="error-code">404</div>
            <h1 class="page-title">
              ${i18n.getTranslation('notFound.title')}
            </h1>
            <p class="description">
              ${i18n.getTranslation('notFound.notAuthDescription')}
            </p>
            <div class="actions">
              <app-button href="/login">
                <app-icon>login</app-icon>
                ${i18n.getTranslation('login.button')}
              </app-button>
            </div>
          </div>
        </div>
      `}
    `;
  }
}

if (!customElements.get('not-found-page')) {
  customElements.define('not-found-page', NotFoundPage);
}

export default NotFoundPage;
