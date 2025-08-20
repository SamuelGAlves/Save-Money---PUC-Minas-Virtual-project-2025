import '../investimentos/components/common/button.js';

let db;
let metaAtualSelecionada = null;

function initDB() {
  const request = indexedDB.open("MetasFinanceiras", 1);

  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains("metas")) {
      const store = db.createObjectStore("metas", { keyPath: "id", autoIncrement: true });
      store.createIndex("nome", "nome", { unique: false });
    }
  };

  request.onsuccess = (e) => {
    db = e.target.result;
    carregarMetas();
  };

  request.onerror = (e) => {
    console.error("Erro ao abrir o banco", e);
  };
}

function carregarMetas() {
  const container = document.getElementById('metasContainer');
  container.innerHTML = '';

  const tx = db.transaction("metas", "readonly");
  const store = tx.objectStore("metas");

  store.openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      const meta = cursor.value;
      criarCardMeta(meta);
      cursor.continue();
    }
  };
}

function criarCardMeta(meta) {
  const container = document.getElementById('metasContainer');

  const card = document.createElement('div');
  card.className = 'meta-card';

  const titulo = document.createElement('h3');
  titulo.textContent = meta.nome;

  const progresso = document.createElement('div');
  progresso.className = 'progress-bar';
  const barra = document.createElement('div');
  barra.className = 'progress';
  const porcentagem = Math.min((meta.atual / meta.valor) * 100, 100);
  barra.style.width = `${porcentagem}%`;
  progresso.appendChild(barra);

  const valorTexto = document.createElement('p');
  valorTexto.textContent = `R$ ${parseFloat(meta.atual).toFixed(2)} de R$ ${parseFloat(meta.valor).toFixed(2)}`;

  const dataTexto = document.createElement('p');
  if (meta.dataLimite === 'sem data limite' || !meta.dataLimite) {
    dataTexto.textContent = 'Sem data limite';
  } else {
    dataTexto.textContent = `Data para atingir: ${meta.dataLimite}`;
  }

  const actions = document.createElement('div');
  actions.className = 'actions';

  const btnIncluir = document.createElement('app-button');
  btnIncluir.setAttribute('variant', 'primary');
  btnIncluir.textContent = 'Incluir Valor';
  btnIncluir.onclick = () => incluirValor(meta);

  const btnEditar = document.createElement('app-button');
  btnEditar.setAttribute('variant', 'secondary');
  btnEditar.textContent = 'Editar';
  btnEditar.onclick = () => abrirModal(meta);

  const btnExcluir = document.createElement('app-button');
  btnExcluir.setAttribute('variant', 'danger');
  btnExcluir.textContent = 'Excluir';
  btnExcluir.onclick = () => excluirMeta(meta.id);

  actions.append(btnIncluir, btnEditar, btnExcluir);
  card.append(titulo, progresso, valorTexto, dataTexto, actions);
  container.appendChild(card);
}

function abrirModal(meta = null) {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';

  document.getElementById('modalTitle').textContent = meta ? 'Editar Meta' : 'Nova Meta';
  document.getElementById('metaId').value = meta ? meta.id : '';
  document.getElementById('metaNome').value = meta ? meta.nome : '';
  document.getElementById('metaValor').value = meta ? meta.valor : '';
  document.getElementById('metaAtual').value = meta ? meta.atual : 0;
  document.getElementById('metaDataLimite').value = meta && meta.dataLimite !== 'sem data limite' ? meta.dataLimite : ''; // Definir data, se existir

  // Oculta campo "Valor Atual" na edição
  document.getElementById('campoAtualWrapper').style.display = meta ? 'none' : 'block';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

function incluirValor(meta) {
  metaAtualSelecionada = meta;
  document.getElementById('valorIncremento').value = '';
  document.getElementById('modalIncluir').style.display = 'flex';
}

function fecharModalIncluir() {
  document.getElementById('modalIncluir').style.display = 'none';
}

function excluirMeta(id) {
  const tx = db.transaction("metas", "readwrite");
  const store = tx.objectStore("metas");
  store.delete(id);
  tx.oncomplete = carregarMetas;
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnNovaMeta').onclick = () => abrirModal();

  document.getElementById('btnCancelar').onclick = () => fecharModal();

  document.getElementById('btnSalvar').onclick = () => {
    document.getElementById('metaForm').requestSubmit();
  };

  document.getElementById('metaForm').onsubmit = (e) => {
    e.preventDefault();

    const id = document.getElementById('metaId').value;
    const nome = document.getElementById('metaNome').value;

    let valor = parseFloat(document.getElementById('metaValor').value.replace(',', '.'));
    let atual = parseFloat(document.getElementById('metaAtual').value.replace(',', '.'));
    const dataLimite = document.getElementById('metaDataLimite').value || 'sem data limite';

    if (isNaN(valor) || isNaN(atual)) {
      alert("Por favor, insira um valor numérico válido.");
      return;
    }

    valor = Math.round(valor * 100) / 100;
    atual = Math.round(atual * 100) / 100;

    if (valor < 0 || atual < 0) {
      alert("Valores negativos não são permitidos.");
      return;
    }

    const tx = db.transaction("metas", "readwrite");
    const store = tx.objectStore("metas");

    if (id) {
      store.put({ id: Number(id), nome, valor, atual, dataLimite });
    } else {
      store.add({ nome, valor, atual, dataLimite });
    }

    tx.oncomplete = () => {
      fecharModal();
      carregarMetas();
    };
  };

  document.getElementById('btnCancelarIncluir').onclick = () => fecharModalIncluir();

  document.getElementById('btnConfirmarIncluir').onclick = (e) => {
    e.preventDefault();

    const valor = parseFloat(document.getElementById('valorIncremento').value);
    if (isNaN(valor) || valor <= 0) {
      alert("Informe um valor válido maior que zero.");
      return;
    }

    const tx = db.transaction("metas", "readwrite");
    const store = tx.objectStore("metas");

    metaAtualSelecionada.atual += valor;
    store.put(metaAtualSelecionada);

    tx.oncomplete = () => {
      fecharModalIncluir();
      carregarMetas();
    };
  };
});

initDB();