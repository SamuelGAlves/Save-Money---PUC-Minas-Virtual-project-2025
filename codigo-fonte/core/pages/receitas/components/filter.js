import { BasePageFilter } from '../../../components/common/page-filter.js';
import { i18n } from '../../../i18n/i18n.js';

class ReceitaFilter extends BasePageFilter {
  constructor() {
    super();
    this.filterKey = 'receitasFilters';
    this.sortOptions = [
      { value: 'value-desc', label: i18n.getTranslation('common.filters.sortOptions.value-desc') },
      { value: 'value-asc', label: i18n.getTranslation('common.filters.sortOptions.value-asc') },
      { value: 'date-desc', label: i18n.getTranslation('common.filters.sortOptions.date-desc') },
      { value: 'date-asc', label: i18n.getTranslation('common.filters.sortOptions.date-asc') }
    ];
    this.statusOptions = [
      { value: '', label: i18n.getTranslation('income.filters.all') },
      { value: 'pending', label: i18n.getTranslation('income.filters.pending') },
      { value: 'today', label: i18n.getTranslation('income.filters.today') },
      { value: 'this-month', label: i18n.getTranslation('income.filters.thisMonth') },
      { value: 'available', label: i18n.getTranslation('income.filters.available') },
      { value: 'recurring', label: i18n.getTranslation('income.filters.recurring') }
    ];
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

if (!customElements.get('receita-filter')) {
  customElements.define('receita-filter', ReceitaFilter);
}

export default ReceitaFilter;
