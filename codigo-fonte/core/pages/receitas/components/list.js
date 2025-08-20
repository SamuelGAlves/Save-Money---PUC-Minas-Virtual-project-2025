import BaseList from '../../../components/lists/base-list.js';
import './card.js';

class ReceitaList extends BaseList {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'receitas'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'receitas') {
      this.setAttribute('items', newValue);
      this.setAttribute('type', 'receita');
    } else {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  render() {
    super.render();

    // Adicionar eventos específicos de receita
    const cards = this.shadowRoot.querySelectorAll('receita-card');
    cards.forEach((card) => {
      card.addEventListener('mark-received', (e) => {
        this.dispatchEvent(
          new CustomEvent('mark-received', {
            detail: { id: e.detail.id },
            bubbles: true,
            composed: true,
          })
        );
      });
    });

    // Adicionar evento para exclusão múltipla
    this.addEventListener('delete-multiple-receita', (e) => {
      this.dispatchEvent(
        new CustomEvent('delete-multiple-receitas', {
          detail: { ids: e.detail.ids },
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

if (!customElements.get('receita-list')) {
  customElements.define('receita-list', ReceitaList);
}

export default ReceitaList;
