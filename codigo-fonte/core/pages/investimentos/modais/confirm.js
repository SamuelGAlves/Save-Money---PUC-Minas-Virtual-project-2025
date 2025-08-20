import ModalBase from "../../../components/modals/modal.js";

class ConfirmDeleteModal extends ModalBase {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
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
          max-width: 400px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease;
        }

        .modal-content h2 {
          margin-bottom: 1.5rem;
          font-size: 1.3rem;
          color: var(--color-text);
        }

        .button-group {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
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
            padding: 1rem;
            margin: 2rem;
          }
          .button-group {
            gap: .5rem;
          }
        }
      </style>

      <div id="modal" role="dialog" aria-labelledby="modal-title">
        <div class="modal-content">
          <h2 id="modal-title">Tem certeza que deseja excluir este investimento?</h2>
          <div class="button-group">
            <app-button id="cancel" aria-label="Cancelar exclusão" variant="danger"><app-icon size="small">close</app-icon>Cancelar</app-button>
            <app-button id="confirm" aria-label="Confirmar exclusão"><app-icon size="small">check</app-icon>Confirmar</app-button>
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

if (!customElements.get('confirm-delete-modal')) {
  customElements.define('confirm-delete-modal', ConfirmDeleteModal);
}

export default ConfirmDeleteModal;
