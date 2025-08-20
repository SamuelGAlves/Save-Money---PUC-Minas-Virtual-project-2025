import { loaderService } from '../services/loader.js';
import toast from '../services/toast.js';
import { getAllReceitas } from './receitas.js';
import { getAllDespesas } from './despesas.js';
import { getAllInvestments } from './investimentos.js';

// Observadores para mudanças nos relatórios
const observers = new Set();

// Função para inscrever um observador
export function subscribeToReports(observer) {
  observers.add(observer);
}

// Função para cancelar inscrição de um observador
export function unsubscribeFromReports(observer) {
  observers.delete(observer);
}

// Função para notificar todos os observadores
function notifyObservers(state) {
  observers.forEach(observer => observer(state));
}

// Função para filtrar itens por período
function filterItemsByDateRange(items, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return items.filter(item => {
    const itemDate = new Date(item.date || item.dueDate);
    return itemDate >= start && itemDate <= end;
  });
}

// Função para calcular o total por moeda
function calculateTotalByCurrency(items, type = 'receita') {
  const totals = {};
  items.forEach(item => {
    const currency = item.currencyType || 'BRL';
    let value = parseFloat(item.value || 0);

    if (type === 'despesa') {
      value = -Math.abs(value);
    }

    totals[currency] = (totals[currency] || 0) + value;
  });
  return totals;
}

// Função para gerar relatório
export async function generateReport(type, startDate, endDate) {
  try {
    loaderService.show('Gerando relatório...');

    // Buscar todos os dados
    const [receitas, despesas, investimentos] = await Promise.all([
      getAllReceitas(),
      getAllDespesas(),
      getAllInvestments()
    ]);

    // Filtrar dados pelo período
    const filteredReceitas = filterItemsByDateRange(receitas, startDate, endDate);
    const filteredDespesas = filterItemsByDateRange(despesas, startDate, endDate);
    const filteredInvestimentos = filterItemsByDateRange(investimentos, startDate, endDate);

    // Estado do relatório
    const reportState = {
      type: type,
      period: {
        start: startDate,
        end: endDate
      },
      totals: {
        investimentos: {},
        receitas: {},
        despesas: {}
      },
      items: {
        investimentos: filteredInvestimentos,
        receitas: filteredReceitas,
        despesas: filteredDespesas
      },
      summary: {
        totalReceitas: 0,
        totalDespesas: 0,
        totalInvestimentos: 0,
        saldo: 0
      }
    };

    // Processar investimentos
    if (filteredInvestimentos.length > 0) {
      reportState.totals.investimentos = calculateTotalByCurrency(filteredInvestimentos, 'investimento');
      reportState.summary.totalInvestimentos = Object.values(reportState.totals.investimentos).reduce((a, b) => a + b, 0);
    }

    // Processar receitas
    if (filteredReceitas.length > 0) {
      reportState.totals.receitas = calculateTotalByCurrency(filteredReceitas, 'receita');
      reportState.summary.totalReceitas = Object.values(reportState.totals.receitas).reduce((a, b) => a + b, 0);
    }

    // Processar despesas
    if (filteredDespesas.length > 0) {
      reportState.totals.despesas = calculateTotalByCurrency(filteredDespesas, 'despesa');
      reportState.summary.totalDespesas = Object.values(reportState.totals.despesas).reduce((a, b) => a + b, 0);
    }

    // Calcular saldo
    reportState.summary.saldo = reportState.summary.totalReceitas + reportState.summary.totalDespesas + reportState.summary.totalInvestimentos;

    notifyObservers(reportState);
    return reportState;
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    toast.error('Erro ao gerar relatório. Por favor, tente novamente.');
    throw error;
  } finally {
    loaderService.hide();
  }
}

// Função para gerar relatório rápido
export async function generateQuickReport(type) {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Primeiro dia do mês
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Último dia do mês

  return generateReport(type, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
}
