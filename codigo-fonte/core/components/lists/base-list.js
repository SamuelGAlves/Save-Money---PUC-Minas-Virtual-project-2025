class BaseList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.items = [];
    this.message = '';
    this.selectionMode = false;
    this.selectedItems = new Set();
  }

  static get observedAttributes() {
    return ['items', 'message', 'type'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'items') {
      this.items = JSON.parse(newValue);
      this.render();
    } else if (name === 'message') {
      this.message = newValue;
      this.render();
    } else if (name === 'type') {
      this.type = newValue;
      this.render();
    }
  }

  render() {
    const items = JSON.parse(this.getAttribute('items') || '[]');
    const message = this.getAttribute('message') || '';
    const type = this.getAttribute('type') || 'default';

    this.shadowRoot.innerHTML = `
      <style>
        #list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
          padding: 1rem 2rem 2rem;
          color: var(--text-color);
        }

        #list.no-items {
          display: flex;
        }

        .selection-controls {
          display: flex;
          gap: 1rem;
          padding: 1rem 2rem;
          background: var(--background-color);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          justify-content: center;
        }

        .card-checkbox {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
          width: 20px;
          height: 20px;
          cursor: pointer;
          pointer-events: none;
        }

        .card-wrapper {
          position: relative;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .card-wrapper.selected {
          opacity: 0.7;
          filter: grayscale(1);
        }

        @media (max-width: 600px) {
          #list {
            padding: 1rem;
          }

          .selection-controls {
            flex-direction: column;
            padding: 1rem;
          }
        }

        @media (min-width: 550px) and (max-width: 999px) {
          #list {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (min-width: 1000px) {
          #list {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (min-width: 1300px) {
          #list {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (min-width: 1600px) {
          #list {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          }
        }

        @media (min-width: 1900px) {
          #list {
            grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          }
        }

        @media (min-width: 2200px) {
          #list {
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          }
        }
      </style>
      ${this.selectionMode ? `
        <div class="selection-controls">
          <app-button id="selectAll" variant="secondary"><app-icon>check</app-icon>Selecionar</app-button>
          <app-button id="deselectAll" variant="secondary"><app-icon>close</app-icon>Limpar</app-button>
          <app-button id="deleteSelected" variant="danger" ${this.selectedItems.size === 0 ? 'disabled' : ''}><app-icon>delete</app-icon>Excluir</app-button>
        </div>
      ` : ''}
      <div id="list" class="${items.length === 0 ? 'no-items' : ''}" role="list">
        ${items.length === 0
          ? `<p role="listitem" aria-live="polite">${message}</p>`
          : items
              .map(
                (item) => {
                  const componentName = type === 'despesa' ? 'despesa-card' :
                                      type === 'receita' ? 'receita-card' :
                                      type === 'investment' ? 'investment-card' :
                                      'base-card';

                  const commonAttributes = `
                    id="${item.id}"
                    title="${item.title}"
                    value="${item.value}"
                    currencyType="${item.currencyType || 'BRL'}"
                    date="${item.date || item.dueDate || ''}"
                    type="${type}"
                    createdAt="${item.createdAt || ''}"
                    role="listitem"
                  `;

                  let specificAttributes = '';

                  if (type === 'despesa') {
                    specificAttributes = `
                      paid="${item.paid || false}"
                      dueDate="${item.dueDate || ''}"
                      isRecurring="${item.isRecurring || false}"
                      recurrenceType="${item.recurrenceType || ''}"
                      recurrenceCount="${item.recurrenceCount || 0}"
                      history='${JSON.stringify(item.history || [])}'
                      recurrences='${JSON.stringify(item.recurrences || [])}'
                    `;
                  } else if (type === 'receita') {
                    specificAttributes = `
                      received="${item.received || false}"
                      period="${item.period || ''}"
                      isRecurring="${item.isRecurring || false}"
                      recurrenceType="${item.recurrenceType || ''}"
                      recurrenceCount="${item.recurrenceCount || 0}"
                      history='${JSON.stringify(item.history || [])}'
                      recurrences='${JSON.stringify(item.recurrences || [])}'
                    `;
                  } else if (type === 'investment') {
                    specificAttributes = `
                      interestRate="${item.interestRate || 0}"
                      interestType="${item.interestType || 'none'}"
                      period="${item.period || ''}"
                      date="${item.date || ''}"
                    `;
                  }

                  const isSelected = this.selectedItems.has(item.id);


                  return `
                    <div class="card-wrapper ${isSelected ? 'selected' : ''}" data-id="${item.id}" style="position: relative;">
                      ${this.selectionMode ? `
                        <input type="checkbox"
                               class="card-checkbox"
                               data-id="${item.id}"
                               ${isSelected ? 'checked' : ''}>
                      ` : ''}
                      <${componentName}
                        ${commonAttributes}
                        ${specificAttributes}
                      ></${componentName}>
                    </div>
                  `;
                }
              )
              .join('')}
      </div>
    `;

    // Adicionando eventos
    const cards = this.shadowRoot.querySelectorAll('despesa-card, receita-card, investment-card, base-card');
    cards.forEach((card) => {
      card.addEventListener('delete', (e) => {
        this.dispatchEvent(
          new CustomEvent(`delete-${type}`, {
            detail: { id: e.detail.id },
            bubbles: true,
            composed: true,
          })
        );
      });

      card.addEventListener('edit', (e) => {
        this.dispatchEvent(
          new CustomEvent(`edit-${type}`, {
            detail: { id: e.detail.id },
            bubbles: true,
            composed: true,
          })
        );
      });

      card.addEventListener('history', (e) => {
        this.dispatchEvent(
          new CustomEvent('show-history', {
            detail: { id: e.detail.id },
            bubbles: true,
            composed: true,
          })
        );
      });

      card.addEventListener('recurring', (e) => {
        this.dispatchEvent(
          new CustomEvent('show-recurring', {
            detail: e.detail,
            bubbles: true,
            composed: true,
          })
        );
      });
    });

    // Adicionando eventos do modo de seleção
    if (this.selectionMode) {
      const cardWrappers = this.shadowRoot.querySelectorAll('.card-wrapper');
      const deleteSelectedBtn = this.shadowRoot.querySelector('#deleteSelected');
      const selectAllBtn = this.shadowRoot.querySelector('#selectAll');
      const deselectAllBtn = this.shadowRoot.querySelector('#deselectAll');



      cardWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', (e) => {
          const id = wrapper.dataset.id;
          const checkbox = wrapper.querySelector('.card-checkbox');

          if (checkbox) {
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
              this.selectedItems.add(id);
              wrapper.classList.add('selected');
            } else {
              this.selectedItems.delete(id);
              wrapper.classList.remove('selected');
            }

            // Atualizar o estado do botão deleteSelected
            const deleteSelectedBtn = this.shadowRoot.querySelector('#deleteSelected');
            if (deleteSelectedBtn) {
              if (this.selectedItems.size === 0) {
                deleteSelectedBtn.setAttribute('disabled', '');
              } else {
                deleteSelectedBtn.removeAttribute('disabled');
              }
            }
          }
        });
      });

      selectAllBtn.addEventListener('click', () => {
        cardWrappers.forEach(wrapper => {
          const id = wrapper.dataset.id;
          const checkbox = wrapper.querySelector('.card-checkbox');
          checkbox.checked = true;
          this.selectedItems.add(id);
          wrapper.classList.add('selected');
        });

        // Atualizar o estado do botão deleteSelected
        const deleteSelectedBtn = this.shadowRoot.querySelector('#deleteSelected');
        if (deleteSelectedBtn) {
          deleteSelectedBtn.removeAttribute('disabled');
        }
      });

      deselectAllBtn.addEventListener('click', () => {
        cardWrappers.forEach(wrapper => {
          const id = wrapper.dataset.id;
          const checkbox = wrapper.querySelector('.card-checkbox');
          checkbox.checked = false;
          this.selectedItems.delete(id);
          wrapper.classList.remove('selected');
        });

        // Atualizar o estado do botão deleteSelected
        const deleteSelectedBtn = this.shadowRoot.querySelector('#deleteSelected');
        if (deleteSelectedBtn) {
          deleteSelectedBtn.setAttribute('disabled', '');
        }
      });

      deleteSelectedBtn.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent(`delete-multiple-${type}`, {
            detail: { ids: Array.from(this.selectedItems) },
            bubbles: true,
            composed: true,
          })
        );
        this.exitSelectionMode();
      });
    }
  }

  exitSelectionMode() {
    this.selectionMode = false;
    this.selectedItems.clear();
    this.render();
  }

  toggleSelectionMode() {
    this.selectionMode = !this.selectionMode;
    if (!this.selectionMode) {
      this.selectedItems.clear();
    }

    this.render();
  }
}

if (!customElements.get('base-list')) {
  customElements.define('base-list', BaseList);
}

export default BaseList;
