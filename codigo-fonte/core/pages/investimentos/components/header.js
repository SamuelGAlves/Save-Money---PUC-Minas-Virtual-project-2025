import { BasePageHeader } from '../../../components/common/page-header.js';
import './filter.js';
import { i18n } from '../../../i18n/i18n.js';

class InvestimentoHeader extends BasePageHeader {
  constructor() {
    super();
    this.title = i18n.getTranslation('investments.title');
    this.icon = 'trending_up';
    this.addButtonLabel = i18n.getTranslation('investments.header.add');
    this.filterComponent = 'investimento-filter';
    this.setAttribute('page-type', 'investimentos');
  }

  update() {
    this.title = i18n.getTranslation('investments.title');
    this.addButtonLabel = i18n.getTranslation('investments.header.add');
    this.render();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    super.render();

    // Adicionar evento para o botão de adicionar
    const addButton = this.shadowRoot.querySelector('#add');
    if (addButton) {
      addButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('add-investimento', { bubbles: true, composed: true }));
      });
    }
  }
}

if (!customElements.get('investimento-header')) {
  customElements.define('investimento-header', InvestimentoHeader);
}

export default InvestimentoHeader;
