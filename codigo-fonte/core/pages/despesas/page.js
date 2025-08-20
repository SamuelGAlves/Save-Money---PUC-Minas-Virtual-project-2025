import {
  getAllDespesas,
  saveDespesaToDB,
  deleteDespesaFromDB,
} from '../../store/despesas.js';

import {
  subscribeToVisibility,
  unsubscribeFromVisibility,
} from '../../store/visibilityStore.js';

import {
  subscribeToTotals,
  unsubscribeFromTotals,
  updateTotals,
} from '../../store/totalsStore.js';

import { formatCurrencyCode } from '../../utils/currency.js';
import { formatFullDate } from '../../utils/date.js';
import toast from '../../services/toast.js';
import { i18n } from '../../i18n/i18n.js';

import './components/list.js';
import './components/header.js';
import './modais/create-update.js';
import './modais/confirm.js';
import '../../components/modals/history-modal.js';
import '../../components/modals/recurring-modal.js';

class DespesaPage extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.handleVisibilityChange = () => {
      this.render();
      // Atualizar os totais após a mudança de visibilidade
      const header = this.shadowRoot.querySelector('despesa-header');
      if (header) {
        const totals = {};
        const estimatedTotals = {};
        let hasRecurring = false;

        this.despesa.forEach(despesa => {
          const currency = despesa.currencyType || 'BRL';
          if (!totals[currency]) {
            totals[currency] = 0;
          }
          totals[currency] += parseFloat(despesa.value || 0);

          if (despesa.isRecurring) {
            hasRecurring = true;
            if (!estimatedTotals[currency]) {
              estimatedTotals[currency] = 0;
            }
            estimatedTotals[currency] += parseFloat(despesa.value || 0);
          }
        });

        header.setTotalValue(totals);
        header.setEstimatedTotal(estimatedTotals);
        header.setHasItems(this.despesa.length > 0);
        header.setItemsCount({ total: this.despesa.length });
        header.setHasRecorrentes(hasRecurring);
        header.render();
      }
    };
    this.handleTotalsChange = (data) => {
      if (data) {
        this.updateTotalComponent(data);
      } else {
        console.warn('[handleTotalsChange] Dados não recebidos, atualizando totais...');
        updateTotals('despesas');
      }
    };
    this.despesa = [];
    this.filteredDespesas = [];
    this.filter = this.loadFilterFromLocalStorage();
  }

  connectedCallback() {
    this.loadDespesa();
    subscribeToVisibility(this.handleVisibilityChange);
    subscribeToTotals(this.handleTotalsChange);
    this._i18nUnsubscribe = i18n.addObserver(() => {
      this.render();
    });

    // Adicionar listener para o evento mark-recurring-paid
    document.addEventListener('mark-recurring-paid', (event) => {
      this.markRecurringPaid(event);
    });
  }

  disconnectedCallback() {
    unsubscribeFromVisibility(this.handleVisibilityChange);
    unsubscribeFromTotals(this.handleTotalsChange);
    document.removeEventListener('mark-recurring-paid', this.markRecurringPaid);
    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
  }

  loadFilterFromLocalStorage() {
    const savedFilter = localStorage.getItem('despesasFilters');
    if (savedFilter) {
      return JSON.parse(savedFilter);
    }
    return { search: '', sort: 'value-desc', status: 'pending', startDate: '', endDate: '' }; // Filtro padrão com datas
  }

  saveFilterToLocalStorage() {
    localStorage.setItem('despesaFilters', JSON.stringify(this.filter));
  }

  async loadDespesa() {
    try {
      this.despesa = await getAllDespesas();

      if (!Array.isArray(this.despesa)) {
        console.error('Erro: getAllDespesas não retornou um array');
        this.despesa = [];
      }

      // Garantir que todas as despesas recorrentes tenham o campo recurrences
      this.despesa = this.despesa.map(despesa => {
        if (despesa.isRecurring) {
          const updatedDespesa = {
            ...despesa,
            recurrences: despesa.recurrences || []
          };

          return updatedDespesa;
        }
        return despesa;
      });

      this.applyFilters();

      // Atualizar totais antes de renderizar
      const totalsData = await updateTotals('despesas');

      // Renderizar a página com os dados atualizados
      this.render();

      // Atualizar o componente de totais com os dados calculados
      this.updateTotalComponent(totalsData);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
      toast.error(i18n.getTranslation('expenses.errors.load'));
      this.despesa = [];
      this.filteredDespesas = [];
      this.render();
    }
  }

  async saveDespesa({ id, title, value, dueDate, paid, isRecurring, recurrenceType, recurrenceCount, createdAt, history, currencyType = 'BRL' }) {
    try {
      const existingIndex = this.despesa.findIndex((inv) => inv.id === id);
      const now = new Date().toISOString();

      if (existingIndex !== -1) {
        const existing = this.despesa[existingIndex];

        // Mapear nomes amigáveis para os campos
        const fieldNames = {
          title: 'Título',
          value: 'Valor',
          dueDate: 'Data de Vencimento',
          paid: 'Status de Pagamento',
          isRecurring: 'Recorrência',
          recurrenceType: 'Tipo de Recorrência',
          recurrenceCount: 'Número de Repetições',
          currencyType: 'Tipo de Moeda'
        };

        // Mapear valores amigáveis para campos específicos
        const formatValue = (field, value) => {
          if (field === 'value') return formatCurrencyCode(value, currencyType);
          if (field === 'dueDate') return formatFullDate(new Date(value + 'T00:00:00'));
          if (field === 'paid') return value ? 'Pago' : 'Não Pago';
          if (field === 'isRecurring') return value ? 'Sim' : 'Não';
          if (field === 'recurrenceType') {
            return value === 'weekly' ? 'Semanal' :
                   value === 'monthly' ? 'Mensal' :
                   value === 'yearly' ? 'Anual' : value;
          }
          if (field === 'recurrenceCount') {
            if (value === 0) return 'Indefinido';
            return value;
          }
          if (field === 'currencyType') {
            return value === 'BRL' ? 'Real (R$)' :
                   value === 'USD' ? 'Dólar (US$)' :
                   value === 'EUR' ? 'Euro (€)' : value;
          }
          return value;
        };

        // Criar entrada no histórico
        const historyEntry = {
          timestamp: now,
          type: 'update',
          changes: {
            title: title !== existing.title ? {
              field: fieldNames.title,
              from: existing.title,
              to: title
            } : null,
            value: value !== existing.value ? {
              field: fieldNames.value,
              from: formatValue('value', existing.value),
              to: formatValue('value', value)
            } : null,
            dueDate: dueDate !== existing.dueDate ? {
              field: fieldNames.dueDate,
              from: formatValue('dueDate', existing.dueDate),
              to: formatValue('dueDate', dueDate)
            } : null,
            paid: paid !== existing.paid ? {
              field: fieldNames.paid,
              from: formatValue('paid', existing.paid),
              to: formatValue('paid', paid)
            } : null,
            isRecurring: isRecurring !== existing.isRecurring ? {
              field: fieldNames.isRecurring,
              from: formatValue('isRecurring', existing.isRecurring),
              to: formatValue('isRecurring', isRecurring)
            } : null,
            recurrenceType: recurrenceType !== existing.recurrenceType ? {
              field: fieldNames.recurrenceType,
              from: existing.recurrenceType ? formatValue('recurrenceType', existing.recurrenceType) : 'Não definido',
              to: recurrenceType ? formatValue('recurrenceType', recurrenceType) : 'Não definido'
            } : null,
            recurrenceCount: recurrenceCount !== existing.recurrenceCount ? {
              field: fieldNames.recurrenceCount,
              from: existing.recurrenceCount,
              to: recurrenceCount
            } : null,
            currencyType: currencyType !== existing.currencyType ? {
              field: fieldNames.currencyType,
              from: formatValue('currencyType', existing.currencyType),
              to: formatValue('currencyType', currencyType)
            } : null
          }
        };

        // Filtrar apenas as mudanças que realmente ocorreram
        historyEntry.changes = Object.fromEntries(
          Object.entries(historyEntry.changes).filter(([_, change]) => change !== null)
        );

        // Se a recorrência foi alterada, gerar novas recorrências
        let recurrences = existing.recurrences || [];
        if (isRecurring && (
          recurrenceType !== existing.recurrenceType ||
          recurrenceCount !== existing.recurrenceCount ||
          dueDate !== existing.dueDate
        )) {
          const startDate = new Date(dueDate);
          let currentDate = new Date(startDate);
          let count = 0;
          recurrences = [];

          // Gerar a primeira recorrência (data inicial)
          recurrences.push({
            date: currentDate.toISOString().split('T')[0],
            paid: false
          });

          // Gerar as recorrências subsequentes
          while (recurrenceCount === 0 || count < recurrenceCount - 1) {
            // Avançar para a próxima data
            switch (recurrenceType) {
              case 'daily':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
              case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
              case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
              case 'yearly':
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;
            }

            // Adicionar a recorrência
            recurrences.push({
              date: currentDate.toISOString().split('T')[0],
              paid: false
            });

            count++;
          }
        }

        const updated = {
          ...existing,
          title,
          value,
          dueDate,
          paid,
          isRecurring,
          recurrenceType,
          recurrenceCount,
          currencyType,
          history: [...(existing.history || []), historyEntry],
          recurrences
        };

        await saveDespesaToDB(updated);
        this.despesa[existingIndex] = updated;
        toast.success(i18n.getTranslation('expenses.success.update'));
      } else {
        const newDespesa = {
          id,
          title,
          value,
          dueDate,
          paid,
          isRecurring,
          recurrenceType,
          recurrenceCount,
          currencyType,
          createdAt: now,
          recurrences: [],
          history: [{
            timestamp: now,
            type: 'create',
            changes: {
              title: { field: 'Título', value: title },
              value: { field: 'Valor', value: formatCurrencyCode(value, currencyType) },
              dueDate: { field: 'Data de Vencimento', value: formatFullDate(new Date(dueDate + 'T00:00:00')) },
              paid: { field: 'Status de Pagamento', value: paid ? 'Pago' : 'Não Pago' },
              isRecurring: { field: 'Recorrência', value: isRecurring ? 'Sim' : 'Não' },
              currencyType: { field: 'Tipo de Moeda', value: formatCurrencyCode(0, currencyType).replace('0,00', '').trim() },
              recurrenceType: {
                field: 'Tipo de Recorrência',
                value: recurrenceType ?
                  (recurrenceType === 'weekly' ? 'Semanal' :
                   recurrenceType === 'monthly' ? 'Mensal' :
                   'Anual') : 'Não definido'
              },
              recurrenceCount: {
                field: 'Número de Repetições',
                value: recurrenceCount === 0 ? 'Indefinido' : value
              }
            }
          }]
        };

        // Se for uma despesa recorrente, gerar as recorrências
        if (isRecurring) {
          const startDate = new Date(dueDate);
          let currentDate = new Date(startDate);
          let count = 0;

          // Gerar a primeira recorrência (data inicial)
          newDespesa.recurrences.push({
            date: currentDate.toISOString().split('T')[0],
            paid: false
          });

          // Gerar as recorrências subsequentes
          while (recurrenceCount === 0 || count < recurrenceCount - 1) {
            // Avançar para a próxima data
            switch (recurrenceType) {
              case 'daily':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
              case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
              case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
              case 'yearly':
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;
            }

            // Adicionar a recorrência
            newDespesa.recurrences.push({
              date: currentDate.toISOString().split('T')[0],
              paid: false
            });

            count++;
          }
        }

        await saveDespesaToDB(newDespesa);
        this.despesa.push(newDespesa);
        toast.success(i18n.getTranslation('expenses.success.create'));
      }

      await this.loadDespesa();
    } catch (error) {
      console.error('Erro ao salvar a despesa:', error);
      toast.error(i18n.getTranslation('expenses.errors.save'));
    }
  }

  editDespesa(id) {
    const despesa = this.despesa.find((d) => d.id === id);
    if (despesa) {
      this.modal.open(despesa);
    }
  }

  async deleteDespesa(id) {
    const despesaIndex = this.despesa.findIndex((inv) => inv.id === id);
    if (despesaIndex !== -1) {
      const despesa = this.despesa[despesaIndex];

      // Abre o modal de confirmação de exclusão
      this.confirmDeleteModal.open(() => {
        deleteDespesaFromDB(despesa.id);
        this.loadDespesa();
        toast.success(i18n.getTranslation('expenses.success.delete'));
      });
    }
  }

  async deleteMultipleDespesas(ids) {
    // Abre o modal de confirmação de exclusão
    this.confirmDeleteModal.open(() => {
      // Excluir cada despesa
      Promise.all(ids.map(id => deleteDespesaFromDB(id)))
        .then(() => {
          this.loadDespesa();
          toast.success(i18n.getTranslation('expenses.success.deleteMultiple'));
        })
        .catch(error => {
          console.error('Erro ao excluir despesas:', error);
          toast.error(i18n.getTranslation('expenses.errors.deleteMultiple'));
        });
    });
  }

  applyFilters() {
    const { search, sort, status, startDate, endDate } = this.filter;

    // Filtrar por título
    this.filteredDespesas = this.despesa.filter((inv) =>
      inv.title.toLowerCase().includes(search.toLowerCase())
    );

    // Filtrar por data
    if (startDate || endDate) {
      this.filteredDespesas = this.filteredDespesas.filter((inv) => {
        const invDate = new Date(inv.dueDate + 'T00:00:00');
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

      this.filteredDespesas = this.filteredDespesas.filter((inv) => {
        const date = new Date(inv.dueDate + 'T00:00:00');
        date.setHours(0, 0, 0, 0);

        switch (status) {
          case 'today':
            return date.getTime() === today.getTime() && !inv.paid;
          case 'available':
            return date > today && !inv.paid;
          case 'paid':
            return inv.paid;
          case 'overdue':
            return date < today && !inv.paid;
          case 'recurring':
            return inv.isRecurring;
          default:
            return true;
        }
      });
    }

    // Ordenar
    if (sort === 'value-desc') {
      this.filteredDespesas.sort((a, b) => b.value - a.value);
    } else if (sort === 'value-asc') {
      this.filteredDespesas.sort((a, b) => a.value - b.value);
    } else if (sort === 'date-desc') {
      this.filteredDespesas.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else if (sort === 'date-asc') {
      this.filteredDespesas.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
  }

  // Função para calcular o valor total estimado de uma despesa recorrente
  calculateEstimatedTotal(despesa) {
    if (!despesa.isRecurring) return 0;

    const startDate = new Date(despesa.dueDate);
    const today = new Date();
    let total = 0;
    let currentDate = new Date(startDate);
    let count = 0;

    // Se a data de início é futura, não inclui no total
    if (currentDate > today) {
      total += parseFloat(despesa.value);
    }

    while (true) {
      // Se atingiu o número máximo de repetições
      if (despesa.recurrenceCount > 0 && count >= despesa.recurrenceCount) break;

      // Incrementa a data baseado no tipo de recorrência
      switch (despesa.recurrenceType) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }

      // Se a nova data é futura, adiciona ao total
      if (currentDate > today) {
        total += parseFloat(despesa.value);
      }

      count++;
    }

    return total;
  }

  // Função para obter o total estimado de todas as despesas recorrentes
  getEstimatedTotal() {
    return this.despesa.reduce((total, despesa) => {
      if (despesa.isRecurring) {
        return total + this.calculateEstimatedTotal(despesa);
      }
      return total;
    }, 0);
  }

  async updateTotalComponent(data) {
    if (!data) {
      console.warn('Nenhum dado recebido para atualizar totais');
      return;
    }

    const header = this.shadowRoot.querySelector('despesa-header');
    if (header) {
      try {
        const { totals, estimatedTotals, hasRecurring } = data;

        // Atualizar os totais usando as propriedades genéricas
        header.setTotalValue(totals);
        header.setEstimatedTotal(estimatedTotals);
        header.setHasItems(this.despesa.length > 0);
        header.setItemsCount({ total: this.despesa.length });
        header.setHasRecorrentes(hasRecurring);

        // Forçar atualização do header
        header.render();
      } catch (error) {
        console.error('Erro ao atualizar totais:', error);
        toast.error('Erro ao calcular totais. Por favor, tente novamente.');
      }
    } else {
      console.warn('Header não encontrado!');
    }
  }

  updateListComponent() {
    const list = this.shadowRoot.querySelector('despesa-list');
    if (list) {
      // Determinar a mensagem apropriada
      if (this.despesa.length === 0) {
        list.setAttribute('message', i18n.getTranslation('expenses.empty.message'));
      } else if (this.filteredDespesas.length === 0) {
        list.setAttribute('message', i18n.getTranslation('expenses.empty.filter'));
      } else {
        list.setAttribute('message', '');
      }

      // Atualizar as despesas filtradas no componente
      list.setAttribute('despesas', JSON.stringify(this.filteredDespesas));
    }
  }

  async markDespesaAsPaid(id) {
    try {
      const despesaIndex = this.despesa.findIndex((inv) => inv.id === id);
      if (despesaIndex !== -1) {
        const despesa = this.despesa[despesaIndex];
        const updated = { ...despesa, paid: !despesa.paid };

        // Criar entrada no histórico
        const historyEntry = {
          timestamp: new Date().toISOString(),
          type: 'update',
          changes: {
            paid: {
              field: 'Status de Pagamento',
              from: despesa.paid ? 'Pago' : 'Não pago',
              to: updated.paid ? 'Pago' : 'Não pago'
            }
          }
        };

        // Adicionar ao histórico
        updated.history = [...(despesa.history || []), historyEntry];

        await saveDespesaToDB(updated);
        this.despesa[despesaIndex] = updated;

        // Atualizar o card diretamente
        const list = this.shadowRoot.querySelector('despesa-list');
        if (list) {
          const card = list.shadowRoot.querySelector(`despesa-card[id="${id}"]`);
          if (card) {
            card.setAttribute('paid', updated.paid);
            card.setAttribute('history', JSON.stringify(updated.history));
          }
        }

        toast.success(i18n.getTranslation('expenses.success.markPaid'));
      }
    } catch (error) {
      console.error('Erro ao marcar despesa como paga:', error);
      toast.error(i18n.getTranslation('expenses.errors.markPaid'));
    }
  }

  async markRecurringPaid(event) {
    const { id, date, isPaid, history, recurrences } = event.detail;

    try {
      const despesa = this.despesa.find(d => d.id === id);
      if (!despesa) {
        console.error('Despesa não encontrada:', id);
        return;
      }

      // Atualizar os dados da despesa
      despesa.history = history;
      despesa.recurrences = recurrences;

      // Salvar no banco de dados
      await saveDespesaToDB(despesa);

      // Atualizar a lista local
      this.despesa = this.despesa.map(d =>
        d.id === id ? despesa : d
      );

      // Atualizar o card diretamente na UI
      const list = this.shadowRoot.querySelector('despesa-list');
      if (list) {
        const card = list.shadowRoot.querySelector(`despesa-card[id="${id}"]`);
        if (card) {
          card.setAttribute('history', JSON.stringify(despesa.history));
          card.setAttribute('recurrences', JSON.stringify(despesa.recurrences));
        }
      }

      // Atualizar o total sem recarregar a lista
      this.updateTotalComponent();
      toast.success(i18n.getTranslation('expenses.success.markRecurringPaid'));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast.error(i18n.getTranslation('expenses.errors.markRecurringPaid'));
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        section.despesas-page {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }
      </style>
      <section class="despesas-page">
        <despesa-header></despesa-header>
        <despesa-list></despesa-list>
        <despesa-modal></despesa-modal>
        <confirm-delete-modal></confirm-delete-modal>
        <history-modal></history-modal>
        <recurring-modal></recurring-modal>
      </section>
    `;

    // Referência aos modais
    this.modal = this.shadowRoot.querySelector('despesa-modal');
    this.confirmDeleteModal = this.shadowRoot.querySelector('confirm-delete-modal');
    this.historyModal = this.shadowRoot.querySelector('history-modal');
    this.recurringModal = this.shadowRoot.querySelector('recurring-modal');

    const header = this.shadowRoot.querySelector('despesa-header');
    if (!header) {
      console.error('Componente despesa-header não encontrado no DOM');
      return;
    }

    header.addEventListener('filter-change', (e) => {
      this.filter = { ...this.filter, ...e.detail };
      this.saveFilterToLocalStorage();
      this.applyFilters();
      this.updateListComponent();
    });

    header.addEventListener('add-despesa', () => {
      this.modal.open();
    });

    // Adicionar listener para o modo de seleção
    header.addEventListener('toggle-selection-mode', () => {
      const list = this.shadowRoot.querySelector('despesa-list');
      list.toggleSelectionMode();
    });

    this.modal.addEventListener('save-despesa', (e) => this.saveDespesa(e.detail));

    const list = this.shadowRoot.querySelector('despesa-list');
    list.setAttribute('despesas', JSON.stringify(this.filteredDespesas));

    list.addEventListener('edit-despesa', (e) => this.editDespesa(e.detail.id));
    list.addEventListener('delete-despesa', (e) => this.deleteDespesa(e.detail.id));
    list.addEventListener('mark-as-paid', (e) => this.markDespesaAsPaid(e.detail.id));
    list.addEventListener('show-history', (e) => {
      const despesa = this.despesa.find(d => d.id === e.detail.id);
      if (despesa) {
        this.historyModal.open(despesa);
      }
    });

    list.addEventListener('show-recurring', (e) => {
      const despesa = this.despesa.find(d => d.id === e.detail.id);
      if (despesa) {
        this.recurringModal.open(despesa, 'despesa');
      }
    });

    // Adicionar listener para exclusão múltipla
    list.addEventListener('delete-multiple-despesas', (e) => {
      this.deleteMultipleDespesas(e.detail.ids);
    });

    this.updateListComponent();
  }
}

if (!customElements.get('despesas-page')) {
  customElements.define('despesas-page', DespesaPage);
}

export default DespesaPage;
