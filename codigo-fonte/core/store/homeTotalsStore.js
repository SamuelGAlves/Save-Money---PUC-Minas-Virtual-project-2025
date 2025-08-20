import { loaderService } from '../services/loader.js';
import toast from '../services/toast.js';
import { getAllReceitas } from './receitas.js';
import { getAllDespesas } from './despesas.js';
import { getAllInvestments } from './investimentos.js';

// Observadores para mudanças nos totais
const observers = new Set();

// Função para inscrever um observador
export function subscribeToHomeTotals(observer) {

  observers.add(observer);
}

// Função para cancelar inscrição de um observador
export function unsubscribeFromHomeTotals(observer) {

  observers.delete(observer);
}

// Função para notificar todos os observadores
function notifyObservers(state) {

  observers.forEach(observer => observer(state));
}

// Função para calcular o valor total estimado de uma receita recorrente
function calculateEstimatedTotal(receita) {
  //

  if (!receita.isRecurring) {
    //
    return 0;
  }

  const startDate = new Date(receita.date);
  const endDate = receita.period ? new Date(receita.period) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normaliza para comparar só a data

  //

  let total = 0;
  let currentDate = new Date(startDate);
  let count = 0;

  // Se a data de início é hoje ou futura, inclui no total
  if (currentDate >= today) {
    total += parseFloat(receita.value);
    //
  }

  while (true) {
    if (receita.recurrenceCount > 0 && count >= receita.recurrenceCount) {
      //
      break;
    }
    if (endDate && currentDate > endDate) {
      //
      break;
    }

    // Incrementa a data baseado no tipo de recorrência
    switch (receita.recurrenceType) {
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

    //

    // Se a nova data é hoje ou futura, adiciona ao total
    if (currentDate >= today) {
      total += parseFloat(receita.value);
      //
    }

    count++;
  }

  //
  return total;
}

// Função para calcular o valor total estimado de uma despesa recorrente
function calculateEstimatedTotalDespesa(despesa) {


  if (!despesa.isRecurring) {

    return 0;
  }

  const startDate = new Date(despesa.dueDate);
  const endDate = despesa.period ? new Date(despesa.period) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normaliza para comparar só a data



  let total = 0;
  let currentDate = new Date(startDate);
  let count = 0;

  // Se a data de início é hoje ou futura, inclui no total
  if (currentDate >= today) {
    total += parseFloat(despesa.value);

  }

  while (true) {
    if (despesa.recurrenceCount > 0 && count >= despesa.recurrenceCount) {

      break;
    }
    if (endDate && currentDate > endDate) {

      break;
    }

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



    // Se a nova data é hoje ou futura, adiciona ao total
    if (currentDate >= today) {
      total += parseFloat(despesa.value);

    }

    count++;
  }


  return total;
}

// Função para calcular o total por moeda
function calculateTotalByCurrency(items, type = 'receita') {
  //
  const totals = {};
  items.forEach(item => {
    const currency = item.currencyType || 'BRL';
    let value = parseFloat(item.value || 0);

    // Se for despesa, converte para negativo
    if (type === 'despesa') {
      value = -Math.abs(value);
    }

    totals[currency] = (totals[currency] || 0) + value;

    //
  });
  //
  return totals;
}

// Função para calcular o total estimado por moeda
function calculateEstimatedTotalByCurrency(items, type = 'receita') {
  //
  const estimatedTotals = {};
  const allCurrencies = new Set(items.map(item => item.currencyType || 'BRL'));
  allCurrencies.forEach(currency => {
    estimatedTotals[currency] = 0;
  });

  items.forEach(item => {
    if (item.isRecurring) {
      const currency = item.currencyType || 'BRL';
      const estimatedValue = type === 'receita' ?
        calculateEstimatedTotal(item) :
        calculateEstimatedTotalDespesa(item);

      estimatedTotals[currency] = (estimatedTotals[currency] || 0) + estimatedValue;
    }
  });

  return estimatedTotals;
}

// Função para calcular a quantidade de itens por moeda
function calculateItemsCountByCurrency(items) {
  //
  const itemsCount = {};
  items.forEach(item => {
    const currency = item.currencyType || 'BRL';
    itemsCount[currency] = (itemsCount[currency] || 0) + 1;
  });
  return itemsCount;
}

// Função para calcular a quantidade de recorrências por moeda
function calculateRecurrencesCountByCurrency(items) {
  //
  const recurrencesCount = {};
  items.forEach(item => {
    if (item.isRecurring) {
      const currency = item.currencyType || 'BRL';
      const count = item.recurrenceCount > 0 ? item.recurrenceCount : 1;
      recurrencesCount[currency] = (recurrencesCount[currency] || 0) + count;
    }
  });
  return recurrencesCount;
}

// Função para verificar se existem itens recorrentes
function hasRecurringItems(items) {
  return items.some(item => item.isRecurring);
}

// Função para atualizar os totais da home
export async function updateHomeTotals() {
  //
  try {
    loaderService.show('Calculando totais...');

    // Buscar todos os dados
    const [receitas, despesas, investimentos] = await Promise.all([
      getAllReceitas(),
      getAllDespesas(),
      getAllInvestments()
    ]);

    //

    // Estado inicial
    const state = {
      totals: {
        investimentos: {},
        receitas: {},
        despesas: {}
      },
      estimatedTotals: {
        investimentos: {},
        receitas: {},
        despesas: {}
      },
      itemsCount: {
        investimentos: {},
        receitas: {},
        despesas: {}
      },
      recurrencesCount: {
        investimentos: {},
        receitas: {},
        despesas: {}
      },
      hasRecurring: false
    };

    // Processar investimentos
    if (investimentos.length > 0) {
      const investimentosTotals = calculateTotalByCurrency(investimentos, 'investimento');
      const investimentosItemsCount = calculateItemsCountByCurrency(investimentos);

      state.totals.investimentos = investimentosTotals;
      state.itemsCount.investimentos = investimentosItemsCount;
    }

    // Processar receitas
    if (receitas.length > 0) {
      const receitasTotals = calculateTotalByCurrency(receitas, 'receita');
      const receitasEstimatedTotals = calculateEstimatedTotalByCurrency(receitas, 'receita');
      const receitasItemsCount = calculateItemsCountByCurrency(receitas);
      const receitasRecurrencesCount = calculateRecurrencesCountByCurrency(receitas);
      state.hasRecurring = state.hasRecurring || hasRecurringItems(receitas);

      state.totals.receitas = receitasTotals;
      state.estimatedTotals.receitas = receitasEstimatedTotals;
      state.itemsCount.receitas = receitasItemsCount;
      state.recurrencesCount.receitas = receitasRecurrencesCount;
    }

    // Processar despesas
    if (despesas.length > 0) {
      const despesasTotals = calculateTotalByCurrency(despesas, 'despesa');
      const despesasEstimatedTotals = calculateEstimatedTotalByCurrency(despesas, 'despesa');
      const despesasItemsCount = calculateItemsCountByCurrency(despesas);
      const despesasRecurrencesCount = calculateRecurrencesCountByCurrency(despesas);
      state.hasRecurring = state.hasRecurring || hasRecurringItems(despesas);

      // Converter valores estimados de despesas para negativo
      Object.keys(despesasEstimatedTotals).forEach(currency => {
        despesasEstimatedTotals[currency] = -Math.abs(despesasEstimatedTotals[currency]);
      });

      state.totals.despesas = despesasTotals;
      state.estimatedTotals.despesas = despesasEstimatedTotals;
      state.itemsCount.despesas = despesasItemsCount;
      state.recurrencesCount.despesas = despesasRecurrencesCount;
    }

    //

    notifyObservers(state);
    return state;
  } catch (error) {
    console.error('[updateHomeTotals] Erro ao atualizar totais:', error);
    toast.error('Erro ao calcular totais. Por favor, tente novamente.');
    throw error;
  } finally {
    loaderService.hide();
  }
}
