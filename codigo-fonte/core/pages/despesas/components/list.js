import BaseList from '../../../components/lists/base-list.js';
import './card.js';

class DespesaList extends BaseList {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'despesas'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'despesas') {
      this.setAttribute('items', newValue);
      this.setAttribute('type', 'despesa');
    } else {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  render() {
    super.render();

    // Adicionar eventos específicos de despesa
    const cards = this.shadowRoot.querySelectorAll('despesa-card');
    cards.forEach((card) => {
      card.addEventListener('pay', (e) => {
        this.dispatchEvent(
          new CustomEvent('mark-as-paid', {
            detail: { id: e.detail.id },
            bubbles: true,
            composed: true,
          })
        );
      });
    });

    // Adicionar evento para exclusão múltipla
    this.addEventListener('delete-multiple-despesa', (e) => {
      this.dispatchEvent(
        new CustomEvent('delete-multiple-despesas', {
          detail: { ids: e.detail.ids },
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

if (!customElements.get('despesa-list')) {
  customElements.define('despesa-list', DespesaList);
}

export default DespesaList;
