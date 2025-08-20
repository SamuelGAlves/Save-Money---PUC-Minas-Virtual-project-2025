import {
  getAllInvestments,
  saveInvestmentToDB,
  deleteInvestmentFromDB,
} from '../../store/investimentos.js';

import {
  subscribeToVisibility,
  unsubscribeFromVisibility,
} from '../../store/visibilityStore.js';

import toast from '../../services/toast.js';
import { i18n } from '../../i18n/i18n.js';

import './components/list.js';
import './components/header.js';
import './components/filter.js';
import './modais/create-update.js';
import './modais/confirm.js';
import '../../components/modals/history-modal.js';

class InvestmentsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleVisibilityChange = () => this.render();
    this.investments = [];
    this.filteredInvestments = [];
    this.filter = this.loadFilterFromLocalStorage();
  }

  connectedCallback() {
    subscribeToVisibility(this.handleVisibilityChange);
    this.loadInvestments();
    this._i18nUnsubscribe = i18n.addObserver(() => {
      this.render();
    });
  }

  disconnectedCallback() {
    unsubscribeFromVisibility(this.handleVisibilityChange);
    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
  }

  loadFilterFromLocalStorage() {
    const savedFilter = localStorage.getItem('investimentosFilters');
    if (savedFilter) {
      return JSON.parse(savedFilter);
    }
    return { search: '', sort: 'value-desc', status: '', startDate: '', endDate: '' };
  }

  saveFilterToLocalStorage() {
    localStorage.setItem('investimentosFilters', JSON.stringify(this.filter));
  }

  async loadInvestments() {
    this.investments = await getAllInvestments();
    this.applyFilters();
    this.render();
  }

  async saveInvestment({ id, title, value, date, period, interestRate, interestType, currencyType }) {
    try {
      const existingIndex = this.investments.findIndex((inv) => inv.id === id);

      // Criar entrada de histórico
      const today = new Date().toISOString().split('T')[0];
      const historyEntry = {
        date: today,
        value: parseFloat(value),
        currencyType,
        interestRate: parseFloat(interestRate) || 0,
        interestType: interestType || 'none',
        rentability: this.calculateRentability({
          value: parseFloat(value),
          date,
          interestRate: parseFloat(interestRate) || 0,
          interestType: interestType || 'none'
        })
      };

      if (existingIndex !== -1) {
        // O investimento já existe, atualize-o

        const existing = this.investments[existingIndex];
        const history = existing.history || [];
        history.push(historyEntry);

        const updated = {
          ...existing,
          title,
          value: parseFloat(value),
          currencyType,
          date,
          period,
          interestRate: parseFloat(interestRate) || 0,
          interestType: interestType || 'none',
          history
        };

        await saveInvestmentToDB(updated);
        this.investments[existingIndex] = updated;
      } else {
        // O investimento não existe, adicione-o como novo

        const newInvestment = {
          id,
          title,
          value: parseFloat(value),
          currencyType,
          date,
          period,
          interestRate: parseFloat(interestRate) || 0,
          interestType: interestType || 'none',
          history: [historyEntry],
          createdAt: new Date().toISOString()
        };

        await saveInvestmentToDB(newInvestment);
        this.investments.push(newInvestment);
      }

      // Recarregar os investimentos do IndexedDB para garantir consistência
      await this.loadInvestments();
    } catch (error) {
      console.error('Erro ao salvar o investimento:', error);
    }
  }

  calculateRentability(investment) {
    if (!investment.value || !investment.date || investment.interestType === 'none') {
      return 0;
    }

    const today = new Date();
    const start = new Date(investment.date + 'T00:00:00');
    const diffInDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));

    if (diffInDays <= 0) {
      return 0;
    }

    let dailyRate;
    if (investment.interestType === 'month') {
      dailyRate = investment.interestRate / 100 / 30;
    } else if (investment.interestType === 'year') {
      dailyRate = investment.interestRate / 100 / 365;
    } else {
      return 0;
    }

    return investment.value * (dailyRate * diffInDays);
  }

  editInvestment(id) {
    const inv = this.investments.find((inv) => inv.id === id);
    if (inv) {
      this.modal.open({ ...inv });
    }
  }

  async deleteInvestment(id) {
    const investmentIndex = this.investments.findIndex((inv) => inv.id === id);
    if (investmentIndex !== -1) {
      const investment = this.investments[investmentIndex];

      // Abre o modal de confirmação de exclusão
      this.confirmDeleteModal.open(() => {
        deleteInvestmentFromDB(investment.id);
        this.loadInvestments();
      });
    }
  }

  async deleteMultipleInvestments(ids) {
    // Abre o modal de confirmação de exclusão
    this.confirmDeleteModal.open(() => {
      // Excluir cada investimento
      Promise.all(ids.map(id => deleteInvestmentFromDB(id)))
        .then(() => {
          this.loadInvestments();
          toast.success('Investimentos excluídos com sucesso!');
        })
        .catch(error => {
          console.error('Erro ao excluir investimentos:', error);
          toast.error('Erro ao excluir investimentos. Por favor, tente novamente.');
        });
    });
  }

  applyFilters() {
    const { search, sort, status, startDate, endDate } = this.filter;

    // Filtrar por título
    this.filteredInvestments = this.investments.filter((inv) =>
      inv.title.toLowerCase().includes(search.toLowerCase())
    );

    // Filtrar por data
    if (startDate || endDate) {
      this.filteredInvestments = this.filteredInvestments.filter((inv) => {
        const invDate = new Date(inv.date + 'T00:00:00');
        const start = startDate ? new Date(startDate + 'T00:00:00') : null;
        const end = endDate ? new Date(endDate + 'T00:00:00') : null;

        if (start && end) {
          return invDate >= start && invDate <= end;
        } else if (start) {
          return invDate >= start;
        } else if (end) {
          return invDate <= end;
        }
        return true;
      });
    }

    // Filtrar por status
    if (status) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.filteredInvestments = this.filteredInvestments.filter((inv) => {
        const start = new Date(inv.date + 'T00:00:00');
        const end = inv.period ? new Date(inv.period + 'T00:00:00') : null;

        start.setHours(0, 0, 0, 0);
        if (end) end.setHours(0, 0, 0, 0);

        switch (status) {
          case 'last-day':
            return end && today.getTime() === end.getTime();
          case 'starting-today':
            return today.getTime() === start.getTime() && (!end || today.getTime() !== end.getTime());
          case 'available':
            return today < start;
          case 'active':
            return today > start && (!end || today < end);
          case 'finished':
            return end && today > end;
          default:
            return true;
        }
      });
    }

    // Ordenar
    if (sort === 'value-desc') {
      this.filteredInvestments.sort((a, b) => b.value - a.value);
    } else if (sort === 'value-asc') {
      this.filteredInvestments.sort((a, b) => a.value - b.value);
    } else if (sort === 'date-desc') {
      this.filteredInvestments.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === 'date-asc') {
      this.filteredInvestments.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  }

  updateTotalComponent() {
    const headerComponent = this.shadowRoot.querySelector('investimento-header');
    if (!headerComponent) {
      console.warn('Componente investimento-header não encontrado no DOM.');
      return;
    }

    // Calcular totais por moeda
    const totalsByCurrency = {};
    this.investments.forEach(inv => {
      const currency = inv.currencyType || 'BRL';
      if (!totalsByCurrency[currency]) {
        totalsByCurrency[currency] = 0;
      }
      totalsByCurrency[currency] += parseFloat(inv.value || 0);
    });

    // Atualizar os totais no header
    headerComponent.setTotalValue(totalsByCurrency);
    headerComponent.setHasItems(this.investments.length > 0);
    headerComponent.setItemsCount({ total: this.investments.length });
    headerComponent.setHasRecorrentes(false);

    // Forçar atualização do header
    headerComponent.render();
  }

  updateListComponent() {
    const list = this.shadowRoot.querySelector('investment-list');

    if (!list) {
      console.warn('Componente investment-list não encontrado no DOM.');
      return;
    }

    if (this.investments.length === 0) {
      list.setAttribute('message', i18n.getTranslation('investments.empty.message'));
    } else if (this.filteredInvestments.length === 0) {
      list.setAttribute('message', i18n.getTranslation('investments.empty.filter'));
    } else {
      list.setAttribute('message', '');
    }

    list.setAttribute('investments', JSON.stringify(this.filteredInvestments));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        section.investments-page {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }
      </style>
      <section class="investments-page">
        <investimento-header></investimento-header>
        <investment-list></investment-list>
        <investment-modal></investment-modal>
        <confirm-delete-modal></confirm-delete-modal>
        <history-modal></history-modal>
      </section>
    `;

    this.modal = this.shadowRoot.querySelector('investment-modal');
    this.confirmDeleteModal = this.shadowRoot.querySelector('confirm-delete-modal');
    this.historyModal = this.shadowRoot.querySelector('history-modal');

    const header = this.shadowRoot.querySelector('investimento-header');
    if (header) {
      header.addEventListener('add-investimento', () => {
        this.modal.open();
      });

      header.addEventListener('filter-change', (e) => {
        this.filter = { ...this.filter, ...e.detail };
        this.saveFilterToLocalStorage();
        this.applyFilters();
        this.updateListComponent();
      });

      // Adicionar listener para o modo de seleção
      header.addEventListener('toggle-selection-mode', () => {
        const list = this.shadowRoot.querySelector('investment-list');
        list.toggleSelectionMode();
      });
    }

    this.modal.addEventListener('save-investment', (e) =>
      this.saveInvestment(e.detail)
    );

    const list = this.shadowRoot.querySelector('investment-list');
    if (list) {
      list.setAttribute('investments', JSON.stringify(this.filteredInvestments));

      list.addEventListener('edit-investment', (e) => this.editInvestment(e.detail.id));
      list.addEventListener('delete-investment', (e) => this.deleteInvestment(e.detail.id));
      list.addEventListener('show-history', (e) => {
        const investment = this.investments.find(i => i.id === e.detail.id);
        if (investment) {
          this.historyModal.open(investment);
        }
      });

      // Adicionar listener para exclusão múltipla
      list.addEventListener('delete-multiple-investments', (e) => {
        this.deleteMultipleInvestments(e.detail.ids);
      });
    }

    this.updateTotalComponent();
    this.updateListComponent();
  }
}

if (!customElements.get('investments-page')) {
  customElements.define('investments-page', InvestmentsPage);
}

export default InvestmentsPage;
