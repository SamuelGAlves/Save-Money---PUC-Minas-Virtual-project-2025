class AppToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.toasts = [];
    this.lastToast = null;
    this.debounceTimeout = null;
  }

  connectedCallback() {
    this.render();

    // Escuta eventos globais para exibir toasts
    window.addEventListener('toast', (event) => {
      const { message, variant = 'info', duration = 3000 } = event.detail;

      // Verifica se é um toast duplicado
      if (this.isDuplicateToast(message, variant)) {
        return;
      }

      // Debounce para evitar múltiplos toasts em sequência
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      this.debounceTimeout = setTimeout(() => {
        this.addToast(message, variant, duration);
      }, 100);
    });
  }

  isDuplicateToast(message, variant) {
    // Verifica se existe um toast idêntico nos últimos 2 segundos
    if (this.lastToast) {
      const now = Date.now();
      if (now - this.lastToast.timestamp < 2000 &&
          this.lastToast.message === message &&
          this.lastToast.variant === variant) {
        return true;
      }
    }
    return false;
  }

  addToast(message, variant, duration) {
    const id = Date.now();
    this.toasts.push({ id, message, variant, exiting: false });

    // Atualiza o último toast
    this.lastToast = {
      message,
      variant,
      timestamp: id
    };

    this.render();

    // Agendar a remoção do toast após o tempo configurado
    setTimeout(() => {
      this.startToastExit(id);
    }, duration);
  }

  startToastExit(id) {
    // Marca o toast como "exiting" para ativar a animação de saída
    const toastIndex = this.toasts.findIndex((toast) => toast.id === id);
    if (toastIndex !== -1) {
      this.toasts[toastIndex].exiting = true;
      this.render();

      // Remove o toast após a duração da animação de saída
      setTimeout(() => {
        this.removeToast(id);
      }, 300); // Duração da animação de saída (deve coincidir com o CSS)
    }
  }

  removeToast(id) {
    // Remove o toast do array
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 0.5rem;
          left: 0.5rem;
          z-index: 9999;
          display: flex;
          flex-direction: column;
        }

        .toast__container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-right: 1rem;
        }

        .toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          box-shadow: 0 4px 6px var(--toast-shadow-color);
          color: var(--toast-text-color);
          animation: fadeIn 0.3s ease;
          transition: transform 0.3s ease, opacity 0.3s ease;
          cursor: pointer;
        }

        .toast.exiting {
          animation: fadeOut 0.3s ease forwards;
        }

        .toast.info {
          background-color: var(--toast-info-bg-color);
        }

        .toast.success {
          background-color: var(--toast-success-bg-color);
        }

        .toast.warning {
          background-color: var(--toast-warning-bg-color);
          color: var(--toast-warning-text-color);
        }

        .toast.error {
          background-color: var(--toast-error-bg-color);
        }

        app-icon {
          font-size: 1.5rem;
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

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      </style>
      <div class="toast__container" role="region" aria-live="polite" aria-atomic="true">
        ${this.toasts
          .map(
            (toast) => `
            <div class="toast ${toast.variant} ${toast.exiting ? 'exiting' : ''}" role="alert" data-id="${toast.id}">
              ${(() => {
                const iconElement = document.createElement('app-icon');
                iconElement.textContent = this.getIconName(toast.variant);
                iconElement.setAttribute('aria-hidden', 'true');
                return iconElement.outerHTML;
              })()}
              <span>${toast.message}</span>
            </div>
          `
          )
          .join('')}
      </div>
    `;

    this.shadowRoot.querySelectorAll('.toast').forEach((toastElement) => {
      toastElement.addEventListener('click', (event) => {
        const toastId = parseInt(toastElement.dataset.id, 10);
        this.startToastExit(toastId);
      });
    });
  }

  getIconName(variant) {
    switch (variant) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }
}

if (!customElements.get('app-toast')) {
  customElements.define('app-toast', AppToast);
}

export default AppToast;
