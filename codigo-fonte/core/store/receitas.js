import authService from '../services/auth.js';
import cryptoService from '../../core/services/crypto.js';
import secureStorage from '../../core/services/secure-storage.js';
import toast from '../../core/services/toast.js';
import { loaderService } from '../../core/services/loader.js';

let DB_NAME;
const STORE_NAME = 'receitas';

// Inicializa o nome do banco com base no email do usuário logado
async function initializeDBName() {
  if (!DB_NAME) {
    const session = await authService.getLoggedUser();
    const user = session?.user;

    if (!user?.email) {
      throw new Error('Usuário não autenticado');
    }

    DB_NAME = await cryptoService.generateDeterministicKey(`${user.email}:receitas`);
  }
}

export async function getAllReceitas() {
  try {
    await initializeDBName();
    loaderService.show('Carregando receitas...');
    await new Promise(resolve => setTimeout(resolve, 500));
    const receitas = await secureStorage.getAllFromIndexedDB(DB_NAME, STORE_NAME);

    return receitas;
  } catch (error) {
    console.error('Erro ao acessar banco de dados:', error);
    toast.error('Erro ao carregar receitas. Por favor, tente novamente.');
    throw error;
  } finally {
    loaderService.hide();
  }
}

export async function saveReceitaToDB(receita) {
  try {
    await initializeDBName();
    loaderService.show('Salvando receita...');
    await new Promise(resolve => setTimeout(resolve, 500));
    await secureStorage.saveToIndexedDB(DB_NAME, STORE_NAME, receita);

    toast.success('Receita salva com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar receita:', error);
    toast.error('Erro ao salvar receita. Por favor, tente novamente.');
    throw error;
  } finally {
    loaderService.hide();
  }
}

export async function deleteReceitaFromDB(id) {
  try {
    loaderService.show('Excluindo receita...');
    await new Promise(resolve => setTimeout(resolve, 500));
    await initializeDBName();
    await secureStorage.deleteFromIndexedDB(DB_NAME, STORE_NAME, id);
    toast.success('Receita excluída com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar receita:', error);
    toast.error('Erro ao excluir receita. Por favor, tente novamente.');
    throw error;
  } finally {
    loaderService.hide();
  }
}
