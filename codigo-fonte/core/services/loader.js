class LoaderService {
  constructor() {
    this.loader = null;
  }

  show(message = 'Carregando...', size = 'large') {
    // Cria o loader se não existir
    if (!this.loader) {
      this.loader = document.createElement('app-loader');
      document.body.appendChild(this.loader);
    }

    this.loader.setAttribute('message', message);
    this.loader.setAttribute('size', size);
    this.loader.setAttribute('type', 'full');
    this.loader.removeAttribute('hiding');

    // Previne scroll do body
    document.body.style.overflow = 'hidden';
  }

  hide() {
    if (!this.loader) return;

    this.loader.setAttribute('hiding', '');

    setTimeout(() => {
      if (this.loader && this.loader.parentNode) {
        // Remove o loader do DOM
        this.loader.remove();
        this.loader = null;
        // Restaura scroll do body
        document.body.style.overflow = '';
      }
    }, 300);
  }

  // Método para mostrar loader com timeout
  showWithTimeout(message = 'Carregando...', timeout = 3000) {
    this.show(message);
    setTimeout(() => this.hide(), timeout);
  }
}

export const loaderService = new LoaderService();
