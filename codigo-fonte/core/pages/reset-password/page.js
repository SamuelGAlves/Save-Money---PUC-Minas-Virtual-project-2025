import './content.js';
import LayoutHero from '../../components/template/hero/template.js';

class ResetPasswordPage extends LayoutHero {
  constructor() {
    super();
    this.image = `./codigo-fonte/core/pages/reset-password/imagens/hero-image.jpg`;
    this.showBackButton = true;
  }

  connectedCallback() {
    super.connectedCallback();

  }

  renderContent() {
    return `<reset-password-content class="content"></reset-password-content>`;
  }
}

if (!customElements.get('reset-password-page')) {
  customElements.define('reset-password-page', ResetPasswordPage);
}

export default ResetPasswordPage;
