const menuLateral = document.querySelector('.menu-lateral');
const botaoToggle = document.getElementById('toggleMenu');

let menuFechado = false;

botaoToggle.addEventListener('click', () => {
    menuFechado = !menuFechado;
    menuLateral.classList.toggle('menu-fechado', menuFechado);
});

let db;

const request = indexedDB.open("FinanceDB", 2);

request.onsuccess = function (event) {
  db = event.target.result;
  carregarDespesasAVencer();
};

request.onerror = function () {
  console.error("Erro ao abrir IndexedDB");
};

function carregarDespesasAVencer() {

  const tx = db.transaction("despesas", "readonly");
  const store = tx.objectStore("despesas");
  const request = store.getAll();

  request.onsuccess = () => {
    const despesas = request.result;
    const container = document.body;

    despesas.forEach((despesa) => {
      const dataVenc = new Date(despesa["data-vencimento"]);
      const hoje = new Date();

      if (!isNaN(dataVenc) && dataVenc >= hoje) {
        const diasRestantes = Math.ceil((dataVenc - hoje) / (1000 * 60 * 60 * 24));
        const div = document.createElement("div");
        div.classList.add("container");

        div.innerHTML = `
          <h2>${despesa.nome}</h2>
          <p><strong>Vencimento:</strong> ${formatarData(dataVenc)}</p>
          <p><strong>Valor:</strong> R$ ${despesa.valor.toFixed(2)}</p>
          <p><strong>Categoria:</strong> ${despesa.categoria}</p>
          <p><strong>recorrencia:</strong> ${despesa.recorrente}</p>
          ${despesa.recorrente !== "Não" ? `<p><strong>Frequencia:</strong> ${despesa.frequencia}</p>` : ""}
          <p style="color: red; font-weight: bold;"> VENCE EM ${diasRestantes} DIA${diasRestantes !== 1 ? 'S' : ''} </p>
`;

        container.appendChild(div);
      }
    });
  };
}

function formatarData(data) {
  return data.toLocaleDateString("pt-BR");
}
