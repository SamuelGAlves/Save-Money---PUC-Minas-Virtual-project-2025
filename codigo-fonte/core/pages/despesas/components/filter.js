import { BasePageFilter } from '../../../components/common/page-filter.js';
import { i18n } from '../../../i18n/i18n.js';

class DespesaFilter extends BasePageFilter {
  constructor() {
    super();
    this.filterKey = 'despesaFilters';
    this.sortOptions = [
      { value: 'value-desc', label: i18n.getTranslation('common.filters.sortOptions.value-desc') },
      { value: 'value-asc', label: i18n.getTranslation('common.filters.sortOptions.value-asc') },
      { value: 'date-desc', label: i18n.getTranslation('common.filters.sortOptions.date-desc') },
      { value: 'date-asc', label: i18n.getTranslation('common.filters.sortOptions.date-asc') }
    ];
    this.statusOptions = [
      { value: '', label: i18n.getTranslation('expenses.filters.all') },
      { value: 'today', label: i18n.getTranslation('expenses.filters.today') },
      { value: 'available', label: i18n.getTranslation('expenses.filters.available') },
      { value: 'paid', label: i18n.getTranslation('expenses.filters.paid') },
      { value: 'overdue', label: i18n.getTranslation('expenses.filters.overdue') },
      { value: 'recurring', label: i18n.getTranslation('expenses.filters.recurring') }
    ];
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

if (!customElements.get('despesa-filter')) {
  customElements.define('despesa-filter', DespesaFilter);
}

export default DespesaFilter;
