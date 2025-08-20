// Importações necessárias
import { loaderService } from '../services/loader.js';
import toast from '../services/toast.js';
import { getAllReceitas } from './receitas.js';
import { getAllDespesas } from './despesas.js';
import { getAllInvestments } from './investimentos.js';

// Observadores para mudanças nos totais
const observers = new Set();

// Função para inscrever um observador
export function subscribeToTotals(observer) {

  observers.add(observer);
}

// Função para cancelar inscrição de um observador
export function unsubscribeFromTotals(observer) {

  observers.delete(observer);
}

// Função para notificar todos os observadores
function notifyObservers(totals, estimatedTotals, hasRecurring, itemsCount, recurrencesCount) {

  observers.forEach(observer => {
    observer({ totals, estimatedTotals, hasRecurring, itemsCount, recurrencesCount });
  });
}

// Função para calcular o valor total estimado de uma receita recorrente
export function calculateEstimatedTotal(receita) {
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
export function calculateEstimatedTotalDespesa(despesa) {


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
export function calculateTotalByCurrency(items) {

  const totals = {};
  items.forEach(item => {
    const currency = item.currencyType || 'BRL';
    const value = parseFloat(item.value || 0);
    totals[currency] = (totals[currency] || 0) + value;

  });

  return totals;
}

// Função para calcular o total estimado por moeda
export function calculateEstimatedTotalByCurrency(items, type = 'receita') {


  const estimatedTotals = {};
  // Garante que todas as moedas presentes em items aparecem no resultado
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

// Função para verificar se existem itens recorrentes
export function hasRecurringItems(items) {
  const hasRecurring = items.some(item => item.isRecurring);

  return hasRecurring;
}

// Função para calcular a quantidade de itens por moeda
export function calculateItemsCountByCurrency(items) {

  const itemsCount = {};

  items.forEach(item => {
    const currency = item.currencyType || 'BRL';
    itemsCount[currency] = (itemsCount[currency] || 0) + 1;

  });


  return itemsCount;
}

// Função para calcular a quantidade de recorrências por moeda
export function calculateRecurrencesCountByCurrency(items) {

  const recurrencesCount = {};

  items.forEach(item => {
    if (item.isRecurring) {
      const currency = item.currencyType || 'BRL';
      // Se não tiver um número específico de recorrências, conta como 1
      const count = item.recurrenceCount > 0 ? item.recurrenceCount : 1;
      recurrencesCount[currency] = (recurrencesCount[currency] || 0) + count;

    }
  });


  return recurrencesCount;
}

// Função para atualizar os totais e notificar os observadores
export async function updateTotals(pageType = 'all') {

  try {
    loaderService.show('Calculando totais...');

    // Buscar apenas os dados necessários baseado no tipo de página
    let receitas = [], despesas = [], investimentos = [];

    switch (pageType) {
      case 'receitas':
        receitas = await getAllReceitas();
        break;
      case 'despesas':
        despesas = await getAllDespesas();
        break;
      case 'investimentos':
        investimentos = await getAllInvestments();
        break;
      case 'all':
      default:
        [receitas, despesas, investimentos] = await Promise.all([
          getAllReceitas(),
          getAllDespesas(),
          getAllInvestments()
        ]);
        break;
    }



    // Calcular totais apenas para os dados relevantes
    let totals = {};
    let estimatedTotals = {};
    let itemsCount = {};
    let recurrencesCount = {};
    let hasRecurring = false;

    if (receitas.length > 0) {
      const receitasTotals = calculateTotalByCurrency(receitas);
      const receitasEstimatedTotals = calculateEstimatedTotalByCurrency(receitas, 'receita');
      const receitasItemsCount = calculateItemsCountByCurrency(receitas);
      const receitasRecurrencesCount = calculateRecurrencesCountByCurrency(receitas);
      hasRecurring = hasRecurring || hasRecurringItems(receitas);

      if (pageType === 'receitas' || pageType === 'all') {
        Object.keys(receitasTotals).forEach(currency => {
          totals[currency] = (totals[currency] || 0) + receitasTotals[currency];
          estimatedTotals[currency] = (estimatedTotals[currency] || 0) + receitasEstimatedTotals[currency];
          itemsCount[currency] = (itemsCount[currency] || 0) + (receitasItemsCount[currency] || 0);
          recurrencesCount[currency] = (recurrencesCount[currency] || 0) + (receitasRecurrencesCount[currency] || 0);
        });
      }
    }

    if (despesas.length > 0) {
      const despesasTotals = calculateTotalByCurrency(despesas);
      const despesasEstimatedTotals = calculateEstimatedTotalByCurrency(despesas, 'despesa');
      const despesasItemsCount = calculateItemsCountByCurrency(despesas);
      const despesasRecurrencesCount = calculateRecurrencesCountByCurrency(despesas);
      hasRecurring = hasRecurring || hasRecurringItems(despesas);

      if (pageType === 'despesas' || pageType === 'all') {
        Object.keys(despesasTotals).forEach(currency => {
          totals[currency] = (totals[currency] || 0) + Math.abs(despesasTotals[currency]);
          estimatedTotals[currency] = (estimatedTotals[currency] || 0) + Math.abs(despesasEstimatedTotals[currency]);
          itemsCount[currency] = (itemsCount[currency] || 0) + (despesasItemsCount[currency] || 0);
          recurrencesCount[currency] = (recurrencesCount[currency] || 0) + (despesasRecurrencesCount[currency] || 0);
        });
      }
    }

    if (investimentos.length > 0) {
      const investimentosTotals = calculateTotalByCurrency(investimentos);
      const investimentosItemsCount = calculateItemsCountByCurrency(investimentos);

      if (pageType === 'investimentos' || pageType === 'all') {
        Object.keys(investimentosTotals).forEach(currency => {
          totals[currency] = (totals[currency] || 0) + investimentosTotals[currency];
          itemsCount[currency] = (itemsCount[currency] || 0) + (investimentosItemsCount[currency] || 0);
        });
      }
    }

    // Remover moedas com valor zero
    Object.keys(totals).forEach(currency => {
      if (Number(totals[currency]) === 0) {
        delete totals[currency];
        delete estimatedTotals[currency];
        delete itemsCount[currency];
        delete recurrencesCount[currency];
      }
    });



    notifyObservers(totals, estimatedTotals, hasRecurring, itemsCount, recurrencesCount);
    return { totals, estimatedTotals, hasRecurring, itemsCount, recurrencesCount };
  } catch (error) {
    console.error('[updateTotals] Erro ao atualizar totais:', error);
    toast.error('Erro ao calcular totais. Por favor, tente novamente.');
    throw error;
  } finally {
    loaderService.hide();
  }
}
