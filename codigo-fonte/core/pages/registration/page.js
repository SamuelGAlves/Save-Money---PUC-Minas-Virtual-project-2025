import './content.js';
import LayoutHero from '../../components/template/hero/template.js';

class RegistrationPage extends LayoutHero {
  constructor() {
    super();
    this.image = `./codigo-fonte/core/pages/registration/imagens/hero-image.jpg`;
    this.showBackButton = true;
  }

  connectedCallback() {
    super.connectedCallback();

  }

  renderContent() {
    return '<registration-content class="content"></registration-content>';
  }
}

if (!customElements.get('registration-page')) {
  customElements.define('registration-page', RegistrationPage);
}

export default RegistrationPage;
