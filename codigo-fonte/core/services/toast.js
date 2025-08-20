class ToastService {
  constructor() {
    this.defaultDuration = 5000;
  }

  show(message, variant = 'error', duration = this.defaultDuration) {
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: {
          message,
          variant,
          duration,
        },
      })
    );
  }

  success(message, duration = this.defaultDuration) {
    this.show(message, 'success', duration);
  }

  error(message, duration = this.defaultDuration) {
    this.show(message, 'error', duration);
  }

  warning(message, duration = this.defaultDuration) {
    this.show(message, 'warning', duration);
  }

  info(message, duration = this.defaultDuration) {
    this.show(message, 'info', duration);
  }
}

// Exporta uma única instância do serviço
export default new ToastService();
