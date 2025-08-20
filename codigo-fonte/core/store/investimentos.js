import authService from '../services/auth.js';
import cryptoService from '../../core/services/crypto.js';
import secureStorage from '../../core/services/secure-storage.js';
import toast from '../../core/services/toast.js';
import { loaderService } from '../../core/services/loader.js';
import { formatCurrencyBRL } from '../utils/currency.js';
import { formatFullDate } from '../utils/date.js';

let DB_NAME;
const STORE_NAME = 'investimentos';

// Inicializa o nome do banco com base no email do usuário logado
async function initializeDBName() {
  if (!DB_NAME) {
    const session = await authService.getLoggedUser();
    const user = session?.user;

    if (!user?.email) {
      throw new Error('Usuário não autenticado');
    }

    DB_NAME = await cryptoService.generateDeterministicKey(`${user.email}:investimentos`);
  }
}

export async function getAllInvestments() {
  try {
    await initializeDBName();
    loaderService.show('Carregando investimentos...');
    await new Promise(resolve => setTimeout(resolve, 500));
    const investments = await secureStorage.getAllFromIndexedDB(DB_NAME, STORE_NAME);

    return investments;
  } catch (error) {
    console.error('Erro ao acessar banco de dados:', error);
    toast.error('Erro ao carregar investimentos. Por favor, tente novamente.');
    throw error;
  } finally {
    loaderService.hide();
  }
}

export async function saveInvestmentToDB(investment) {
  try {
    await initializeDBName();
    loaderService.show('Salvando investimento...');
    await new Promise(resolve => setTimeout(resolve, 500));

    const now = new Date().toISOString();

    // Obter o investimento existente apenas se for uma atualização
    let existingInvestment = null;
    if (investment.id && investment.history) {
      try {
        existingInvestment = await secureStorage.getFromIndexedDB(DB_NAME, STORE_NAME, investment.id);
      } catch (error) {

      }
    }

    // Mapear nomes amigáveis para os campos
    const fieldNames = {
      title: 'Título',
      value: 'Valor',
      date: 'Data de Início',
      period: 'Data de Fim',
      interestRate: 'Taxa de Juros',
      interestType: 'Tipo de Rentabilidade'
    };

    // Mapear valores amigáveis para campos específicos
    const formatValue = (field, value) => {
      if (field === 'value') return formatCurrencyBRL(value);
      if (field === 'date' || field === 'period') return formatFullDate(new Date(value + 'T00:00:00'));
      if (field === 'interestType') {
        return value === 'month' ? 'Mensal' :
               value === 'year' ? 'Anual' :
               value === 'none' ? 'Sem Rentabilidade' : value;
      }
      if (field === 'interestRate') return `${value?.toFixed(2) || '0'}%`;
      return value;
    };

    let historyEntry;
    if (existingInvestment) {
      // Criar entrada no histórico para atualização
      historyEntry = {
        timestamp: now,
        type: 'update',
        changes: {
          title: investment.title !== existingInvestment.title ? {
            field: fieldNames.title,
            from: existingInvestment.title,
            to: investment.title
          } : null,
          value: investment.value !== existingInvestment.value ? {
            field: fieldNames.value,
            from: formatValue('value', existingInvestment.value),
            to: formatValue('value', investment.value)
          } : null,
          date: investment.date !== existingInvestment.date ? {
            field: fieldNames.date,
            from: formatValue('date', existingInvestment.date),
            to: formatValue('date', investment.date)
          } : null,
          period: investment.period !== existingInvestment.period ? {
            field: fieldNames.period,
            from: existingInvestment.period ? formatValue('period', existingInvestment.period) : 'Não definido',
            to: investment.period ? formatValue('period', investment.period) : 'Não definido'
          } : null,
          interestRate: investment.interestRate !== existingInvestment.interestRate ? {
            field: fieldNames.interestRate,
            from: formatValue('interestRate', existingInvestment.interestRate),
            to: formatValue('interestRate', investment.interestRate)
          } : null,
          interestType: investment.interestType !== existingInvestment.interestType ? {
            field: fieldNames.interestType,
            from: formatValue('interestType', existingInvestment.interestType),
            to: formatValue('interestType', investment.interestType)
          } : null
        }
      };

      // Filtrar apenas as mudanças que realmente ocorreram
      historyEntry.changes = Object.fromEntries(
        Object.entries(historyEntry.changes).filter(([_, change]) => change !== null)
      );
    } else {
      // Criar entrada no histórico para novo investimento
      historyEntry = {
        timestamp: now,
        type: 'create',
        changes: {
          title: { field: fieldNames.title, value: investment.title },
          value: { field: fieldNames.value, value: formatValue('value', investment.value) },
          date: { field: fieldNames.date, value: formatValue('date', investment.date) },
          period: { field: fieldNames.period, value: investment.period ? formatValue('period', investment.period) : 'Não definido' },
          interestRate: { field: fieldNames.interestRate, value: formatValue('interestRate', investment.interestRate) },
          interestType: { field: fieldNames.interestType, value: formatValue('interestType', investment.interestType) }
        }
      };
    }

    // Preparar o histórico
    const history = existingInvestment?.history || [];
    history.push(historyEntry);

    // Atualizar o investimento com o histórico
    const investmentWithHistory = {
      ...investment,
      history,
      createdAt: existingInvestment?.createdAt || now
    };


    await secureStorage.saveToIndexedDB(DB_NAME, STORE_NAME, investmentWithHistory);

    toast.success('Investimento salvo com sucesso!');
    return investmentWithHistory;
  } catch (error) {
    console.error('Erro ao salvar investimento:', error);
    toast.error('Erro ao salvar investimento. Por favor, tente novamente.');
    throw error;
  } finally {
    loaderService.hide();
  }
}

function calculateRentability(investment) {
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

export async function deleteInvestmentFromDB(id) {
  try {
    await initializeDBName();
    await secureStorage.deleteFromIndexedDB(DB_NAME, STORE_NAME, id);
    toast.success('Investimento excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar investimento:', error);
    toast.error('Erro ao excluir investimento. Por favor, tente novamente.');
    throw error;
  }
}
