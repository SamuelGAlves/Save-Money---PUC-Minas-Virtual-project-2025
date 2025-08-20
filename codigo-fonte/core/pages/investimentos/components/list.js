import BaseList from '../../../components/lists/base-list.js';
import './card.js';

class InvestmentList extends BaseList {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'investments'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'investments') {
      this.setAttribute('items', newValue);
      this.setAttribute('type', 'investment');
    } else {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  render() {
    super.render();

    // Adicionar eventos específicos de investimento
    const cards = this.shadowRoot.querySelectorAll('investment-card');
    cards.forEach((card) => {
      card.addEventListener('show-history', (e) => {
        this.dispatchEvent(
          new CustomEvent('show-history', {
            detail: { id: e.detail.id },
            bubbles: true,
            composed: true,
          })
        );
      });
    });

    // Adicionar evento para exclusão múltipla
    this.addEventListener('delete-multiple-investment', (e) => {
      this.dispatchEvent(
        new CustomEvent('delete-multiple-investments', {
          detail: { ids: e.detail.ids },
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

if (!customElements.get('investment-list')) {
  customElements.define('investment-list', InvestmentList);
}

export default InvestmentList;
