import { BasePageHeader } from '../../../components/common/page-header.js';
import './filter.js';
import { i18n } from '../../../i18n/i18n.js';

class ReceitaHeader extends BasePageHeader {
  constructor() {
    super();
    this.title = i18n.getTranslation('income.title');
    this.icon = 'savings';
    this.addButtonLabel = i18n.getTranslation('income.header.add');
    this.filterComponent = 'receita-filter';
    this.setAttribute('page-type', 'receitas');
  }

  update() {
    this.title = i18n.getTranslation('income.title');
    this.addButtonLabel = i18n.getTranslation('income.header.add');
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
        this.dispatchEvent(new CustomEvent('add-receita', { bubbles: true, composed: true }));
      });
    }
  }
}

if (!customElements.get('receita-header')) {
  customElements.define('receita-header', ReceitaHeader);
}

export default ReceitaHeader;
