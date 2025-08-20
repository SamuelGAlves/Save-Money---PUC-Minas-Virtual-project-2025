import {
  getAllReceitas,
  saveReceitaToDB,
  deleteReceitaFromDB,
} from '../../store/receitas.js';

import {
  subscribeToVisibility,
  unsubscribeFromVisibility,
} from '../../store/visibilityStore.js';

import {
  subscribeToTotals,
  unsubscribeFromTotals,
  updateTotals
} from '../../store/totalsStore.js';

import { formatCurrencyBRL } from '../../utils/currency.js';
import { formatFullDate } from '../../utils/date.js';
import toast from '../../services/toast.js';

import './components/list.js';
import './components/header.js';
import './modais/create-update.js';
import './modais/confirm.js';
import '../../components/modals/history-modal.js';
import '../../components/modals/recurring-modal.js';
import { i18n } from '../../i18n/i18n.js';

class ReceitasPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleVisibilityChange = () => {
      this.render();
      // Atualizar os totais após a mudança de visibilidade
      const header = this.shadowRoot.querySelector('receita-header');
      if (header) {
        const totals = {};
        const estimatedTotals = {};
        let hasRecurring = false;

        this.receitas.forEach(receita => {
          const currency = receita.currencyType || 'BRL';
          if (!totals[currency]) {
            totals[currency] = 0;
          }
          totals[currency] += parseFloat(receita.value || 0);

          if (receita.isRecurring) {
            hasRecurring = true;
            if (!estimatedTotals[currency]) {
              estimatedTotals[currency] = 0;
            }
            estimatedTotals[currency] += parseFloat(receita.value || 0);
          }
        });

        header.setTotalValue(totals);
        header.setEstimatedTotal(estimatedTotals);
        header.setHasItems(this.receitas.length > 0);

        // Atualiza o header com a contagem por moeda
        const countByCurrency = this.receitas.reduce((acc, receita) => {
          const currency = receita.currencyType || 'BRL';
          acc[currency] = (acc[currency] || 0) + 1;
          return acc;
        }, {});
        header.setItemsCount(countByCurrency);

        header.setHasRecorrentes(hasRecurring);
      }
    };
    this.handleTotalsChange = (data) => {

      if (data) {
        this.updateTotalComponent(data);
      } else {
        console.warn('[handleTotalsChange] Dados não recebidos, atualizando totais...');
        updateTotals('receitas');
      }
    };
    this.receitas = [];
    this.filteredReceitas = [];
    this.filter = this.loadFilterFromLocalStorage(); // Carregar o filtro do localStorage
  }

  connectedCallback() {
    this.loadReceitas();
    subscribeToVisibility(this.handleVisibilityChange);
    subscribeToTotals(this.handleTotalsChange);
    this._i18nUnsubscribe = i18n.addObserver(() => {
      this.render();
    });

    // Adicionar listener para o evento mark-recurring-received
    document.addEventListener('mark-recurring-received', (event) => {

      this.markRecurringReceived(event);
    });
  }

  disconnectedCallback() {
    unsubscribeFromVisibility(this.handleVisibilityChange);
    unsubscribeFromTotals(this.handleTotalsChange);
    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
    // Remover listener do evento
    document.removeEventListener('mark-recurring-received', this.markRecurringReceived);
  }

  loadFilterFromLocalStorage() {
    const savedFilter = localStorage.getItem('receitasFilters');
    if (savedFilter) {
      return JSON.parse(savedFilter);
    }
    return { search: '', sort: 'value-desc', status: '', startDate: '', endDate: '' }; // Filtro padrão com datas
  }

  saveFilterToLocalStorage() {
    localStorage.setItem('receitasFilters', JSON.stringify(this.filter));
  }

  async loadReceitas() {

    try {

      this.receitas = await getAllReceitas();


      // Garantir que todas as receitas recorrentes tenham o campo recurrences
      this.receitas = this.receitas.map(receita => {
        if (receita.isRecurring) {
          const updatedReceita = {
            ...receita,
            recurrences: receita.recurrences || []
          };

          return updatedReceita;
        }
        return receita;
      });


      this.applyFilters();

      // Atualizar totais antes de renderizar

      const totalsData = await updateTotals('receitas');

      // Renderizar a página com os dados atualizados
      this.render();

      // Atualizar o componente de totais com os dados calculados
      this.updateTotalComponent(totalsData);
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
      toast.error('Erro ao carregar receitas. Por favor, tente novamente.');
    }
  }

  async saveReceita({ id, title, value, currencyType = 'BRL', date, period, received, createdAt, isRecurring, recurrenceType, recurrenceCount }) {
    try {
      const existingIndex = this.receitas.findIndex((inv) => inv.id === id);
      const now = new Date().toISOString();

      if (existingIndex !== -1) {
        // O receita já existe, atualize-o

        const existing = this.receitas[existingIndex];

        // Mapear nomes amigáveis para os campos
        const fieldNames = {
          title: 'Título',
          value: 'Valor',
          date: 'Data de Início',
          period: 'Data de Fim',
          received: 'Status de Recebimento',
          isRecurring: 'Recorrência',
          recurrenceType: 'Tipo de Recorrência',
          recurrenceCount: 'Número de Repetições',
          currencyType: 'Tipo de Moeda'
        };

        // Mapear valores amigáveis para campos específicos
        const formatValue = (field, value) => {
          if (field === 'value') return formatCurrencyBRL(value);
          if (field === 'date' || field === 'period') return formatFullDate(new Date(value + 'T00:00:00'));
          if (field === 'received') return value ? 'Recebido' : 'Não Recebido';
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
            return value === 'BRL' ? 'Real' : value;
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
            date: date !== existing.date ? {
              field: fieldNames.date,
              from: formatValue('date', existing.date),
              to: formatValue('date', date)
            } : null,
            period: period !== existing.period ? {
              field: fieldNames.period,
              from: existing.period ? formatValue('period', existing.period) : 'Não definido',
              to: period ? formatValue('period', period) : 'Não definido'
            } : null,
            received: received !== existing.received ? {
              field: fieldNames.received,
              from: formatValue('received', existing.received),
              to: formatValue('received', received)
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
          date !== existing.date ||
          period !== existing.period
        )) {
          const startDate = new Date(date);
          const endDate = period ? new Date(period) : null;
          let currentDate = new Date(startDate);
          let count = 0;
          recurrences = [];

          // Gerar a primeira recorrência (data inicial)
          recurrences.push({
            date: currentDate.toISOString().split('T')[0],
            received: false
          });

          // Gerar as recorrências subsequentes
          while (
            (recurrenceCount === 0 || count < recurrenceCount - 1) &&
            (!endDate || currentDate <= endDate)
          ) {
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
              received: false
            });

            count++;
          }
        }

        const updated = {
          ...existing,
          title,
          value,
          currencyType,
          date,
          period,
          received,
          isRecurring,
          recurrenceType,
          recurrenceCount,
          history: [...(existing.history || []), historyEntry],
          recurrences
        };


        await saveReceitaToDB(updated);
        this.receitas[existingIndex] = updated;
        toast.success('Receita atualizada com sucesso!');
      } else {
        // O receita não existe, adicione-o como novo

        const newReceita = {
          id,
          title,
          value,
          currencyType,
          date,
          period,
          received,
          isRecurring,
          recurrenceType,
          recurrenceCount,
          createdAt: now,
          recurrences: [],
          history: [{
            timestamp: now,
            type: 'create',
            changes: {
              title: { field: 'Título', value: title },
              value: { field: 'Valor', value: formatCurrencyBRL(value) },
              date: { field: 'Data de Início', value: formatFullDate(new Date(date + 'T00:00:00')) },
              period: { field: 'Data de Fim', value: period ? formatFullDate(new Date(period + 'T00:00:00')) : 'Não definido' },
              received: { field: 'Status de Recebimento', value: received ? 'Recebido' : 'Não Recebido' },
              isRecurring: { field: 'Recorrência', value: isRecurring ? 'Sim' : 'Não' },
              recurrenceType: {
                field: 'Tipo de Recorrência',
                value: recurrenceType ?
                  (recurrenceType === 'weekly' ? 'Semanal' :
                   recurrenceType === 'monthly' ? 'Mensal' :
                   'Anual') : 'Não definido'
              },
              recurrenceCount: {
                field: 'Número de Repetições',
                value: recurrenceCount === 0 ? 'Indefinido' : `${recurrenceCount} repetições`
              }
            }
          }]
        };

        // Se for uma receita recorrente, gerar as recorrências
        if (isRecurring) {
          const startDate = new Date(date);
          const endDate = period ? new Date(period) : null;
          let currentDate = new Date(startDate);
          let count = 0;

          // Gerar a primeira recorrência (data inicial)
          newReceita.recurrences.push({
            date: currentDate.toISOString().split('T')[0],
            received: false
          });

          // Gerar as recorrências subsequentes
          while (
            (recurrenceCount === 0 || count < recurrenceCount - 1) &&
            (!endDate || currentDate <= endDate)
          ) {
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
            newReceita.recurrences.push({
              date: currentDate.toISOString().split('T')[0],
              received: false
            });

            count++;
          }
        }


        await saveReceitaToDB(newReceita);
        toast.success('Receita salva com sucesso!');
        this.receitas.push(newReceita);
      }

      await this.loadReceitas();
    } catch (error) {
      console.error('Erro ao salvar o receita:', error);
    }
  }

  editReceita(id) {

    const inv = this.receitas.find((inv) => inv.id === id);
    if (inv) {
      this.modal.open({ ...inv });
    }
  }

  async deleteReceita(id) {


    const receitasIndex = this.receitas.findIndex((inv) => inv.id === id);
    if (receitasIndex !== -1) {
      const receitas = this.receitas[receitasIndex];

      // Abre o modal de confirmação de exclusão
      this.confirmDeleteModal.open(() => {
        deleteReceitaFromDB(receitas.id);
        this.loadReceitas();
      });
    }
  }

  async deleteMultipleReceitas(ids) {


    // Abre o modal de confirmação de exclusão
    this.confirmDeleteModal.open(() => {
      // Excluir cada receita
      Promise.all(ids.map(id => deleteReceitaFromDB(id)))
        .then(() => {
          this.loadReceitas();
          toast.success('Receitas excluídas com sucesso!');
        })
        .catch(error => {
          console.error('Erro ao excluir receitas:', error);
          toast.error('Erro ao excluir receitas. Por favor, tente novamente.');
        });
    });
  }

  async markReceitaAsReceived(id) {
    try {
      const receitaIndex = this.receitas.findIndex((inv) => inv.id === id);
      if (receitaIndex !== -1) {
        const receita = this.receitas[receitaIndex];
        const updated = { ...receita, received: !receita.received };

        // Criar entrada no histórico
        const historyEntry = {
          timestamp: new Date().toISOString(),
          type: 'update',
          changes: {
            received: {
              field: 'Status de Recebimento',
              from: receita.received ? 'Recebido' : 'Não recebido',
              to: updated.received ? 'Recebido' : 'Não recebido'
            }
          }
        };

        // Adicionar ao histórico
        updated.history = [...(receita.history || []), historyEntry];

        await saveReceitaToDB(updated);
        this.receitas[receitaIndex] = updated;

        // Atualizar o card diretamente
        const list = this.shadowRoot.querySelector('receita-list');
        if (list) {
          const card = list.shadowRoot.querySelector(`receita-card[id="${id}"]`);
          if (card) {
            card.setAttribute('received', updated.received);
            card.setAttribute('history', JSON.stringify(updated.history));
          }
        }

        window.dispatchEvent(
          new CustomEvent('toast', {
            detail: {
              message: updated.received ? 'Receita marcada como recebida!' : 'Receita desmarcada como recebida!',
              variant: 'success',
              duration: 5000,
            },
          })
        );
      }
    } catch (error) {
      console.error('Erro ao marcar receita como recebida:', error);
    }
  }

  async markRecurringReceived(event) {

    const { id, date, isReceived, history, recurrences } = event.detail;


    try {

      const receita = this.receitas.find(r => r.id === id);
      if (!receita) {
        console.error('Receita não encontrada:', id);
        return;
      }



      // Atualizar os dados da receita

      receita.history = history;
      receita.recurrences = recurrences;



      // Salvar no banco de dados

      await saveReceitaToDB(receita);


      // Atualizar a lista local

      this.receitas = this.receitas.map(r =>
        r.id === id ? receita : r
      );

      // Atualizar o card diretamente na UI

      const list = this.shadowRoot.querySelector('receita-list');
      if (list) {

        const card = list.shadowRoot.querySelector(`receita-card[id="${id}"]`);
        if (card) {

          card.setAttribute('history', JSON.stringify(receita.history));
          card.setAttribute('recurrences', JSON.stringify(receita.recurrences));
        } else {

        }
      } else {

      }

      // Atualizar o total sem recarregar a lista
      this.updateTotalComponent();

    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      console.error('Stack trace:', error.stack);
      toast.error('Erro ao salvar alterações');
    }
  }

  applyFilters() {
    const { search, sort, status, startDate, endDate } = this.filter;

    // Filtrar por título
    this.filteredReceitas = this.receitas.filter((inv) =>
      inv.title.toLowerCase().includes(search.toLowerCase())
    );

    // Filtrar por data
    if (startDate || endDate) {
      this.filteredReceitas = this.filteredReceitas.filter((inv) => {
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

      this.filteredReceitas = this.filteredReceitas.filter((inv) => {
        const date = new Date(inv.date + 'T00:00:00');
        date.setHours(0, 0, 0, 0);

        // Primeiro dia do mês atual
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        // Primeiro dia do próximo mês
        const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

        switch (status) {
          case 'pending':
            return date > today && !inv.received;
          case 'today':
            return date.getTime() === today.getTime() && !inv.received;
          case 'this-month':
            return date >= firstDayOfMonth && date < firstDayOfNextMonth && date > today && !inv.received;
          case 'available':
            return date > firstDayOfNextMonth && !inv.received;
          case 'recurring':
            return inv.isRecurring;
          default:
            return true;
        }
      });
    }

    // Ordenar
    if (sort === 'value-desc') {
      this.filteredReceitas.sort((a, b) => b.value - a.value);
    } else if (sort === 'value-asc') {
      this.filteredReceitas.sort((a, b) => a.value - b.value);
    } else if (sort === 'date-desc') {
      this.filteredReceitas.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === 'date-asc') {
      this.filteredReceitas.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  }

  async updateTotalComponent(data) {



    if (!data) {
      console.warn('Nenhum dado recebido para atualizar totais');
      return;
    }

    const header = this.shadowRoot.querySelector('receita-header');
    if (header) {

      try {
        const { totals, estimatedTotals, hasRecurring } = data;



        // Atualizar os totais
        header.setTotalValue(totals);
        header.setEstimatedTotal(estimatedTotals);
        header.setHasItems(this.receitas.length > 0);

        // Atualiza o header com a contagem por moeda
        const countByCurrency = this.receitas.reduce((acc, receita) => {
          const currency = receita.currencyType || 'BRL';
          acc[currency] = (acc[currency] || 0) + 1;
          return acc;
        }, {});
        header.setItemsCount(countByCurrency);

        header.setHasRecorrentes(hasRecurring);

        // Forçar uma nova renderização
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
    const list = this.shadowRoot.querySelector('receita-list');

    if (!list) {
      console.warn('Componente receitas-list não encontrado no DOM.');
      return;
    }

    // Determinar a mensagem apropriada
    if (this.receitas.length === 0) {
      list.setAttribute('message', i18n.getTranslation('income.empty.message'));
    } else if (this.filteredReceitas.length === 0) {
      list.setAttribute('message', i18n.getTranslation('income.empty.filter'));
    } else {
      list.setAttribute('message', '');
    }

    // Garantir que todos os atributos necessários estão sendo passados
    const receitasComAtributos = this.filteredReceitas.map(receita => {
      const receitaComAtributos = {
        ...receita,
        currencyType: receita.currencyType || 'BRL',
        isRecurring: receita.isRecurring || false,
        recurrenceType: receita.recurrenceType || '',
        recurrenceCount: receita.recurrenceCount || 0,
        history: receita.history || [],
        recurrences: receita.recurrences || []
      };
      return receitaComAtributos;
    });

    // Atualizar os receitas filtrados no componente
    list.setAttribute('receitas', JSON.stringify(receitasComAtributos));
  }

  render() {

    this.shadowRoot.innerHTML = `
      <style>
        section.receitas-page {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }
      </style>
      <section class="receitas-page">
        <receita-header></receita-header>
        <receita-list></receita-list>
        <receita-modal></receita-modal>
        <confirm-delete-receita-modal></confirm-delete-receita-modal>
        <history-modal></history-modal>
        <recurring-modal></recurring-modal>
      </section>
    `;

    // Referência ao modal
    this.modal = this.shadowRoot.querySelector('receita-modal');
    this.confirmDeleteModal = this.shadowRoot.querySelector('confirm-delete-receita-modal');
    this.historyModal = this.shadowRoot.querySelector('history-modal');
    this.recurringModal = this.shadowRoot.querySelector('recurring-modal');

    const header = this.shadowRoot.querySelector('receita-header');
    header.addEventListener('filter-change', (e) => {
      this.filter = { ...this.filter, ...e.detail };
      this.saveFilterToLocalStorage(); // Salvar o filtro no localStorage
      this.applyFilters();
      this.updateListComponent();
    });

    header.addEventListener('add-receita', () => {

      this.modal.open();
    });

    // Adicionar listener para o modo de seleção
    header.addEventListener('toggle-selection-mode', () => {
      const list = this.shadowRoot.querySelector('receita-list');
      list.toggleSelectionMode();
    });

    // Apenas registrando o evento save-receitas
    this.modal.addEventListener('save-receita', (e) =>
      this.saveReceita(e.detail)
    );

    // Atualizando o atributo receitas no componente receitas-list
    const list = this.shadowRoot.querySelector('receita-list');
    list.setAttribute('receitas', JSON.stringify(this.filteredReceitas));

    // Adicionando eventos de edição e exclusão diretamente nos cards
    list.addEventListener('edit-receita', (e) => this.editReceita(e.detail.id));
    list.addEventListener('delete-receita', (e) => this.deleteReceita(e.detail.id));
    list.addEventListener('mark-received', (e) => this.markReceitaAsReceived(e.detail.id));
    list.addEventListener('show-history', (e) => {

      const receita = this.receitas.find(r => r.id === e.detail.id);

      if (receita) {
        this.historyModal.open(receita);
      }
    });

    list.addEventListener('show-recurring', (e) => {

      const receita = this.receitas.find(r => r.id === e.detail.id);
      if (receita) {
        this.recurringModal.open(receita, 'receita');
      }
    });

    // Adicionar listener para exclusão múltipla
    list.addEventListener('delete-multiple-receitas', (e) => {
      this.deleteMultipleReceitas(e.detail.ids);
    });

    // Atualizar a lista
    this.updateTotalComponent();
    this.updateListComponent();
  }
}

if (!customElements.get('receitas-page')) {
  customElements.define('receitas-page', ReceitasPage);
}

export default ReceitasPage;
