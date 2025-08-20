import ModalBase from "../../../components/modals/modal.js";
import { i18n } from "../../../i18n/i18n.js";

class ConfirmDeleteUserModal extends ModalBase {
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

  open(deleteCallback) {
    super.open();

    this.shadowRoot.querySelector('#modal').style.display = 'flex';
    this.shadowRoot.querySelector('#modal').style.opacity = '1';
    this.deleteCallback = deleteCallback;
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
          max-width: 500px;
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
          margin-bottom: 1rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.4;
          text-align: left;
        }

        .warning-text {
          color: var(--color-danger);
          font-weight: 500;
          margin: 1rem 0;
          padding: 0.75rem;
          background: var(--error-color-light);
          border-radius: 8px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .lgpd-info {
          background: var(--background-card-color);
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-align: left;
          border: 1px solid var(--border-color);
        }

        .button-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .warning-icon {
          color: var(--error-color);
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
            <app-icon class="warning-icon">warning</app-icon>
            ${i18n.getTranslation('modals.deleteAccount.title')}
          </h2>

          <div class="warning-text">
            <app-icon>error</app-icon>
            ${i18n.getTranslation('modals.deleteAccount.warning')}
          </div>

          <p>
            ${i18n.getTranslation('modals.deleteAccount.message')}
          </p>

          <ul style="text-align: left; margin: 0.5rem 0; padding-left: 1.5rem; color: var(--text-secondary);">
            <li>${i18n.getTranslation('modals.deleteAccount.data.personal')}</li>
            <li>${i18n.getTranslation('modals.deleteAccount.data.transactions')}</li>
            <li>${i18n.getTranslation('modals.deleteAccount.data.settings')}</li>
            <li>${i18n.getTranslation('modals.deleteAccount.data.preferences')}</li>
          </ul>

          <div class="lgpd-info">
            <strong>${i18n.getTranslation('modals.deleteAccount.lgpd.title')}</strong>
            <p style="margin: 0.5rem 0 0;">
              ${i18n.getTranslation('modals.deleteAccount.lgpd.message')}
            </p>
          </div>

          <div class="button-group">
            <app-button id="cancel" variant="ghost" aria-label="${i18n.getTranslation('modals.deleteAccount.cancel')}" fullwidth="true">
              <app-icon size="small">arrow_back</app-icon>
              ${i18n.getTranslation('modals.deleteAccount.cancel')}
            </app-button>
            <app-button id="confirm" variant="danger" aria-label="${i18n.getTranslation('modals.deleteAccount.confirm')}" fullwidth="true">
              <app-icon size="small">delete</app-icon>
              ${i18n.getTranslation('modals.deleteAccount.confirm')}
            </app-button>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('#cancel').onclick = () => this.close();
    this.shadowRoot.querySelector('#confirm').onclick = () => {
      if (this.deleteCallback) {
        this.deleteCallback();
      }
      this.close();
    };
  }
}

if (!customElements.get('confirm-delete-user-modal')) {
  customElements.define('confirm-delete-user-modal', ConfirmDeleteUserModal);
}

export default ConfirmDeleteUserModal;
