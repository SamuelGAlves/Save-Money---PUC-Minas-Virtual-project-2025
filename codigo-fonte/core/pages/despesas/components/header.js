import { BasePageHeader } from '../../../components/common/page-header.js';
import './filter.js';
import { i18n } from '../../../i18n/i18n.js';

class DespesaHeader extends BasePageHeader {
  constructor() {
    super();
    this.title = i18n.getTranslation('expenses.title');
    this.icon = 'trending_down';
    this.addButtonLabel = i18n.getTranslation('expenses.header.add');
    this.filterComponent = 'despesa-filter';
    this.setAttribute('page-type', 'despesas');
  }

  update() {
    this.title = i18n.getTranslation('expenses.title');
    this.addButtonLabel = i18n.getTranslation('expenses.header.add');
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
        this.dispatchEvent(new CustomEvent('add-despesa', { bubbles: true, composed: true }));
      });
    }
  }
}

if (!customElements.get('despesa-header')) {
  customElements.define('despesa-header', DespesaHeader);
}

export default DespesaHeader;
