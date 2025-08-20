import './content.js';
import LayoutHero from '../../components/template/hero/template.js';

class RememberPage extends LayoutHero {
  constructor() {
    super();
    this.image = `./codigo-fonte/core/pages/remember/imagens/hero-image.jpg`;
    this.showBackButton = true;
  }

  connectedCallback() {
    super.connectedCallback();

  }

  renderContent() {
    return '<remember-content class="content"></remember-content>';
  }
}

if (!customElements.get('remember-page')) {
  customElements.define('remember-page', RememberPage);
}

export default RememberPage;
