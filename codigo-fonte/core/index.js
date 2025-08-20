// Components
import './components/index.js';

// Router
import { initializeRouter } from './routes/index.js';
import { i18n } from './i18n/i18n.js';

class SaveMoneyCore extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    document.body.style.display = 'flex';
  }

  async connectedCallback() {
    try {
      this.render();

      // Aguarda o render completo e passa o app-router ao roteador
      requestAnimationFrame(() => {
        const router = this.shadowRoot.querySelector('app-router');
        if (router) {
          initializeRouter(router);
        } else {
          console.error('app-router não encontrado dentro do Shadow DOM.');
        }
      });

      // Inicializar o i18n

      await i18n.init();

    } catch (error) {
      console.error('[Core] Erro ao inicializar:', error);
    }
  }

  render() {
    console.info(`
 .d8888b.                             888b     d888
d88P  Y88b                            8888b   d8888
Y88b.                                 88888b.d88888
 "Y888b.    8888b.  888  888  .d88b.  888Y88888P888  .d88b.  88888b.   .d88b.  888  888
    "Y88b.     "88b 888  888 d8P  Y8b 888 Y888P 888 d88""88b 888 "88b d8P  Y8b 888  888
      "888 .d888888 Y88  88P 88888888 888  Y8P  888 888  888 888  888 88888888 888  888
Y88b  d88P 888  888  Y8bd8P  Y8b.     888   "   888 Y88..88P 888  888 Y8b.     Y88b 888
 "Y8888P"  "Y888888   Y88P    "Y8888  888       888  "Y88P"  888  888  "Y8888   "Y88888
                                                                                    888
                                                                               Y8b d88P
                                                                                "Y88P"
8888888b.  888     888  .d8888b.       888b     d888 d8b
888   Y88b 888     888 d88P  Y88b      8888b   d8888 Y8P
888    888 888     888 888    888      88888b.d88888
888   d88P 888     888 888             888Y88888P888 888 88888b.   8888b.  .d8888b
8888888P"  888     888 888             888 Y888P 888 888 888 "88b     "88b 88K
888        888     888 888    888      888  Y8P  888 888 888  888 .d888888 "Y8888b.
888        Y88b. .d88P Y88b  d88P      888   "   888 888 888  888 888  888      X88
888         "Y88888P"   "Y8888P"       888       888 888 888  888 "Y888888  88888P'



88888888888                                  888                   d8b
    888                                      888                   Y8P
    888                                      888
    888   .d88b.   .d8888b 88888b.   .d88b.  888  .d88b.   .d88b.  888  8888b.
    888  d8P  Y8b d88P"    888 "88b d88""88b 888 d88""88b d88P"88b 888     "88b
    888  88888888 888      888  888 888  888 888 888  888 888  888 888 .d888888
    888  Y8b.     Y88b.    888  888 Y88..88P 888 Y88..88P Y88b 888 888 888  888
    888   "Y8888   "Y8888P 888  888  "Y88P"  888  "Y88P"   "Y88888 888 "Y888888
                                                               888
                                                          Y8b d88P
                                                           "Y88P"
`)


    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex: 1;
        }
      </style>
      <app-router></app-router>
      <app-toast></app-toast>
    `;
  }
}

if (!customElements.get('save-money-core')) {
  customElements.define('save-money-core', SaveMoneyCore);
}

export default SaveMoneyCore;
