import ModalBase from "./modal.js";
import { i18n } from "../../i18n/i18n.js";
import authService from "../../services/auth.js";
import { loaderService } from "../../services/loader.js";

class LogoutModal extends ModalBase {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.setupLanguageObserver();
    this.render();
  }

  setupLanguageObserver() {
    i18n.addObserver(() => {
      this.render();
    });
  }

  disconnectedCallback() {
    i18n.removeObserver(this.render);
  }

  open() {

    super.open();
    this.shadowRoot.querySelector('#modal').style.display = 'flex';
    this.shadowRoot.querySelector('#modal').style.opacity = '1';
  }

  async handleLogout() {

    try {
      loaderService.show(i18n.getTranslation('modals.logout.loading'));
      await authService.logout();
      history.pushState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      loaderService.hide();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        #modal {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          justify-content: center;
          align-items: center;
          z-index: 1000;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(5px) grayscale(1);
        }

        .modal-content {
          background-color: var(--background-color);
          padding: 2rem;
          margin: 1rem;
          border-radius: 12px;
          text-align: center;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease;
        }

        .modal-content h2 {
          margin-bottom: 1rem;
          font-size: 1.3rem;
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .modal-content p {
          margin-bottom: 1.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .button-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .logout-icon {
          color: var(--primary-color);
          font-size: 2rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          .modal-content {
            padding: 1.5rem;
            margin: 1rem;
          }
          .button-group {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      </style>

      <div id="modal" role="dialog" aria-labelledby="modal-title">
        <div class="modal-content">
          <h2 id="modal-title">
            <app-icon class="logout-icon">logout</app-icon>
            ${i18n.getTranslation('modals.logout.title')}
          </h2>
          <p>
            ${i18n.getTranslation('modals.logout.message')}
          </p>
          <div class="button-group">
            <app-button id="cancel" variant="ghost" aria-label="${i18n.getTranslation('modals.logout.cancel')}" fullwidth="true">
              <app-icon size="small">arrow_back</app-icon>
              ${i18n.getTranslation('modals.logout.cancel')}
            </app-button>
            <app-button id="confirm" variant="primary" aria-label="${i18n.getTranslation('modals.logout.confirm')}" fullwidth="true">
              <app-icon size="small">logout</app-icon>
              ${i18n.getTranslation('modals.logout.confirm')}
            </app-button>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('#cancel').onclick = () => this.close();
    this.shadowRoot.querySelector('#confirm').onclick = () => {
      this.handleLogout();
      this.close();
    };
  }
}

if (!customElements.get('logout-modal')) {
  customElements.define('logout-modal', LogoutModal);
}

export default LogoutModal;
