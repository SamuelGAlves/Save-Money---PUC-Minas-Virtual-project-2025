import { BasePageFilter } from '../../../components/common/page-filter.js';
import { i18n } from '../../../i18n/i18n.js';

class InvestimentoFilter extends BasePageFilter {
  constructor() {
    super();
    this.filterKey = 'investimentosFilters';
    this.sortOptions = [
      { value: 'value-desc', label: i18n.getTranslation('common.filters.sortOptions.value-desc') },
      { value: 'value-asc', label: i18n.getTranslation('common.filters.sortOptions.value-asc') },
      { value: 'date-desc', label: i18n.getTranslation('common.filters.sortOptions.date-desc') },
      { value: 'date-asc', label: i18n.getTranslation('common.filters.sortOptions.date-asc') }
    ];
    this.statusOptions = [
      { value: '', label: i18n.getTranslation('investments.filters.all') },
      { value: 'active', label: i18n.getTranslation('common.status.active') },
      { value: 'available', label: i18n.getTranslation('common.status.available') },
      { value: 'starting-today', label: i18n.getTranslation('common.status.starting-today') },
      { value: 'last-day', label: i18n.getTranslation('common.status.last-day') },
      { value: 'finished', label: i18n.getTranslation('common.status.finished') }
    ];
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

if (!customElements.get('investimento-filter')) {
  customElements.define('investimento-filter', InvestimentoFilter);
}

export default InvestimentoFilter;
