import authService from '../services/auth.js';
import cryptoService from '../../core/services/crypto.js';
import secureStorage from '../../core/services/secure-storage.js';
import toast from '../../core/services/toast.js';
import { loaderService } from '../../core/services/loader.js';

let DB_NAME;
const STORE_NAME = 'despesas';

// Inicializa o nome do banco com base no email do usuário logado
async function initializeDBName() {
  if (!DB_NAME) {
    const session = await authService.getLoggedUser();
    const user = session?.user;

    if (!user?.email) {
      throw new Error('Usuário não autenticado');
    }

    DB_NAME = await cryptoService.generateDeterministicKey(`${user.email}:despesas`);
  }
}

export async function getAllDespesas() {
  try {
    await initializeDBName();
    loaderService.show('Carregando despesas...');
    await new Promise(resolve => setTimeout(resolve, 500));
    const despesas = await secureStorage.getAllFromIndexedDB(DB_NAME, STORE_NAME);

    return despesas;
  } catch (error) {
    console.error('Erro ao acessar banco de dados:', error);
    toast.error('Erro ao carregar despesas. Por favor, tente novamente.');
    throw error;
  } finally {
    loaderService.hide();
  }
}

export async function saveDespesaToDB(despesa) {
  try {
    await initializeDBName();
    loaderService.show('Salvando despesa...');
    await new Promise(resolve => setTimeout(resolve, 500));
    await secureStorage.saveToIndexedDB(DB_NAME, STORE_NAME, despesa);

  } catch (error) {
    console.error('Erro ao salvar despesa:', error);
    toast.error('Erro ao salvar despesa. Por favor, tente novamente.');
    throw error;
  } finally {
    loaderService.hide();
  }
}

export async function deleteDespesaFromDB(id) {
  try {
    loaderService.show('Excluindo despesa...');
    await new Promise(resolve => setTimeout(resolve, 500));
    await initializeDBName();
    await secureStorage.deleteFromIndexedDB(DB_NAME, STORE_NAME, id);
    toast.success('Despesa excluída com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar despesa:', error);
    toast.error('Erro ao excluir despesa. Por favor, tente novamente.');
    throw error;
  } finally {
    loaderService.hide();
  }
}
