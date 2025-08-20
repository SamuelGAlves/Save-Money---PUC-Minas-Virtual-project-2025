import './content.js';
import LayoutHero from '../../components/template/hero/template.js';
import { i18n } from '../../i18n/i18n.js';

class LoginPage extends LayoutHero {
  constructor() {
    super();
    this.showBackButton = false;
    this.updateImage();
  }

  connectedCallback() {
    super.connectedCallback();


    // Observa mudanças no idioma/moeda
    i18n.addObserver(() => this.updateImage());
  }

  disconnectedCallback() {
    i18n.removeObserver(() => this.updateImage());
  }

  updateImage() {
    const currency = i18n.getTranslation('common.currency');
    this.image = `./codigo-fonte/core/pages/login/imagens/hero-image-${currency}.jpg`;
    this.render();
  }

  renderContent() {
    return '<login-content class="content"></login-content>';
  }
}

if (!customElements.get('login-page')) {
  customElements.define('login-page', LoginPage);
}

export default LoginPage;
