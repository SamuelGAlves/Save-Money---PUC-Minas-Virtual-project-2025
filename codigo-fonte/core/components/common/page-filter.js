import { i18n } from '../../i18n/i18n.js';

export class BasePageFilter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.activeFilters = {
      search: '',
      sort: 'value-desc',
      status: '',
      startDate: '',
      endDate: ''
    };
    this.filterKey = 'filters';
    this.sortOptions = [];
    this.statusOptions = [];
  }

  static get observedAttributes() {
    return ['filter-key', 'sort-options', 'status-options'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'filter-key':
          this.filterKey = newValue;
          break;
        case 'sort-options':
          this.sortOptions = JSON.parse(newValue);
          break;
        case 'status-options':
          this.statusOptions = JSON.parse(newValue);
          break;
      }
      this.loadFiltersFromLocalStorage();
      this.render();
    }
  }

  connectedCallback() {
    this.loadFiltersFromLocalStorage();
    this.render();
  }

  loadFiltersFromLocalStorage() {
    const savedFilters = localStorage.getItem(this.filterKey);
    if (savedFilters) {
      this.activeFilters = JSON.parse(savedFilters);
    }
  }

  saveFiltersToLocalStorage() {
    localStorage.setItem(this.filterKey, JSON.stringify(this.activeFilters));
  }

  updateClearButtonVisibility() {
    const clearFiltersButton = this.shadowRoot.querySelector('#clear-filters');
    const { search, sort, status, startDate, endDate } = this.activeFilters;

    if (search || sort !== 'value-desc' || status || startDate || endDate) {
      clearFiltersButton.style.display = 'flex';
    } else {
      clearFiltersButton.style.display = 'none';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          width: 100%;
        }
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.5rem;
          padding: 1rem;
          background-color: var(--background-color);
          border: 1px solid var(--color-gray-light);
          border-radius: 8px;
        }

        .filters-row {
          display: flex;
          gap: 1rem;
          width: 100%;
          flex-wrap: wrap;
        }

        .filters-row:first-child {
          margin-bottom: 0.5rem;
        }

        label {
          color: var(--text-color);
          white-space: nowrap;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          display: block;
        }

        .filters .input-group {
          flex: 1;
          min-width: 200px;
          display: flex;
          flex-direction: column;
        }

        .filters .select-group {
          flex: 1;
          min-width: 200px;
          display: flex;
          flex-direction: column;
        }

        .filters input,
        .filters select {
          padding: 0.5rem;
          font-size: 1rem;
          border: 2px solid var(--input-border-color);
          border-radius: 6px;
          box-sizing: border-box;
          color: var(--input-text-color);
          background-color: var(--input-background-color);
          outline: none;
          transition: border-color 0.3s ease;
          width: 100%;
        }

        .filters input:focus,
        .filters select:focus {
          border-color: #007bff;
        }

        .filters-select {
          display: flex;
          gap: 1rem;
          width: 100%;
          flex-wrap: wrap;
        }

        .icon-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        #clear-filters {
          display: none;
          align-items: center;
          gap: 0.5rem;
          width: auto;
          margin-top: 0.5rem;
        }

        #clear-filters .text-large {
          display: inline;
        }

        #clear-filters .text-small {
          display: none;
        }

        .date-group {
          display: flex;
          gap: 1rem;
          width: 100%;
        }

        .date-input {
          flex: 1;
          min-width: 200px;
        }

        @media (max-width: 1200px) {
          .filters {
            padding: 0.75rem;
          }

          .filters-row {
            gap: 0.75rem;
          }

          .filters .input-group,
          .filters .select-group {
            min-width: 180px;
          }

          .date-group {
            gap: 0.75rem;
          }
        }

        @media (max-width: 529px) {
          .filters-row {
            flex-direction: column;
          }

          .filters .input-group,
          .filters .select-group,
          .date-input {
            width: 100%;
            min-width: unset;
          }

          .date-group {
            flex-direction: column;
          }

          #clear-filters {
            width: 100%;
          }

          #clear-filters .text-large {
            display: none;
          }

          #clear-filters .text-small {
            display: inline;
          }
        }

        @media (max-width: 450px) {
          .filters {
            padding: 0.75rem;
            gap: 0.75rem;
          }

          .filters-select {
            flex-direction: column;
            gap: 0.75rem;
          }

          .select-group {
            width: 100%;
          }
        }

        @media (max-width: 380px) {
          .filters {
            padding: 0.5rem;
          }

          .filters input,
          .filters select {
            font-size: 0.9rem;
            padding: 0.4rem;
          }

          label {
            font-size: 0.85rem;
          }
        }
      </style>
      <div class="filters">
        <div class="filters-row">
          <div class="input-group">
            <div class="icon-label">
              <app-icon size="small" aria-hidden="true">search</app-icon>
              <label for="search">${i18n.getTranslation('common.filters.search')}</label>
            </div>
            <input
              id="search"
              type="text"
              placeholder="${i18n.getTranslation('common.filters.search')}..."
              aria-label="${i18n.getTranslation('common.filters.search')}"
              value="${this.activeFilters.search}"
            />
          </div>
          <div class="date-group">
            <div class="input-group date-input">
              <label for="startDate">${i18n.getTranslation('reports.form.startDate.label')}</label>
              <input
                id="startDate"
                type="date"
                aria-label="${i18n.getTranslation('reports.form.startDate.label')}"
                value="${this.activeFilters.startDate}"
              />
            </div>
            <div class="input-group date-input">
              <label for="endDate">${i18n.getTranslation('reports.form.endDate.label')}</label>
              <input
                id="endDate"
                type="date"
                aria-label="${i18n.getTranslation('reports.form.endDate.label')}"
                value="${this.activeFilters.endDate}"
              />
            </div>
          </div>
        </div>
        <div class="filters-row">
          <div class="filters-select">
            <div class="select-group">
              <div class="icon-label">
                <app-icon size="small" aria-hidden="true">sort</app-icon>
                <label for="sort">${i18n.getTranslation('common.filters.sort')}</label>
              </div>
              <select id="sort" aria-label="${i18n.getTranslation('common.filters.sort')}">
                ${this.sortOptions.map(option => `
                  <option value="${option.value}" ${this.activeFilters.sort === option.value ? 'selected' : ''}>
                    ${option.label}
                  </option>
                `).join('')}
              </select>
            </div>
            ${this.statusOptions.length > 0 ? `
              <div class="select-group">
                <div class="icon-label">
                  <app-icon size="small" aria-hidden="true">filter_alt</app-icon>
                  <label for="status">${i18n.getTranslation('common.filters.status')}</label>
                </div>
                <select id="status" aria-label="${i18n.getTranslation('common.filters.status')}">
                  ${this.statusOptions.map(option => `
                    <option value="${option.value}" ${this.activeFilters.status === option.value ? 'selected' : ''}>
                      ${option.label}
                    </option>
                  `).join('')}
                </select>
              </div>
            ` : ''}
          </div>
        </div>
        <app-button
          id="clear-filters"
          variant="danger"
          aria-label="${i18n.getTranslation('common.filters.clear')}"
          fullWidth="true"
          size="sm"
        >
          <app-icon aria-hidden="true" size="small">delete_sweep</app-icon>
          <span class="text-large">${i18n.getTranslation('common.filters.clear')}</span>
          <span class="text-small">${i18n.getTranslation('common.filters.clear')}</span>
        </app-button>
      </div>
    `;

    const searchInput = this.shadowRoot.querySelector('#search');
    const sortSelect = this.shadowRoot.querySelector('#sort');
    const statusSelect = this.shadowRoot.querySelector('#status');
    const startDateInput = this.shadowRoot.querySelector('#startDate');
    const endDateInput = this.shadowRoot.querySelector('#endDate');
    const clearFiltersButton = this.shadowRoot.querySelector('#clear-filters');

    searchInput.addEventListener('input', (e) => {
      this.activeFilters.search = e.target.value;
      this.saveFiltersToLocalStorage();
      this.updateClearButtonVisibility();
      this.dispatchEvent(new CustomEvent('filter-change', {
        detail: { ...this.activeFilters },
        bubbles: true,
        composed: true,
      }));
    });

    sortSelect.addEventListener('change', (e) => {
      this.activeFilters.sort = e.target.value;
      this.saveFiltersToLocalStorage();
      this.updateClearButtonVisibility();
      this.dispatchEvent(new CustomEvent('filter-change', {
        detail: { ...this.activeFilters },
        bubbles: true,
        composed: true,
      }));
    });

    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.activeFilters.status = e.target.value;
        this.saveFiltersToLocalStorage();
        this.updateClearButtonVisibility();
        this.dispatchEvent(new CustomEvent('filter-change', {
          detail: { ...this.activeFilters },
          bubbles: true,
          composed: true,
        }));
      });
    }

    startDateInput.addEventListener('change', (e) => {
      this.activeFilters.startDate = e.target.value;
      if (this.activeFilters.endDate && e.target.value > this.activeFilters.endDate) {
        this.activeFilters.endDate = e.target.value;
        endDateInput.value = e.target.value;
      }
      this.saveFiltersToLocalStorage();
      this.updateClearButtonVisibility();
      this.dispatchEvent(new CustomEvent('filter-change', {
        detail: { ...this.activeFilters },
        bubbles: true,
        composed: true,
      }));
    });

    endDateInput.addEventListener('change', (e) => {
      this.activeFilters.endDate = e.target.value;
      if (this.activeFilters.startDate && e.target.value < this.activeFilters.startDate) {
        this.activeFilters.startDate = e.target.value;
        startDateInput.value = e.target.value;
      }
      this.saveFiltersToLocalStorage();
      this.updateClearButtonVisibility();
      this.dispatchEvent(new CustomEvent('filter-change', {
        detail: { ...this.activeFilters },
        bubbles: true,
        composed: true,
      }));
    });

    clearFiltersButton.addEventListener('click', () => {
      this.activeFilters = {
        search: '',
        sort: 'value-desc',
        status: '',
        startDate: '',
        endDate: ''
      };
      searchInput.value = '';
      sortSelect.value = 'value-desc';
      if (statusSelect) statusSelect.value = '';
      startDateInput.value = '';
      endDateInput.value = '';
      this.saveFiltersToLocalStorage();
      this.updateClearButtonVisibility();

      window.dispatchEvent(
        new CustomEvent('toast', {
          detail: {
            message: i18n.getTranslation('common.filters.cleared'),
            variant: 'success',
            duration: 5000,
          },
        })
      );

      this.dispatchEvent(new CustomEvent('filter-change', {
        detail: { ...this.activeFilters },
        bubbles: true,
        composed: true,
      }));
    });

    this.updateClearButtonVisibility();
  }
}

export default BasePageFilter;
