const request = indexedDB.open('FinanceDB', 2);
let db;

request.onsuccess = function (event) {
  db = event.target.result;
};

request.onerror = function () {
  console.error('Erro ao abrir IndexedDB');
};

const resultado = document.getElementById("resultado");

document.getElementById('btnGerar').addEventListener('click', () => {
  const dataInicio = new Date(document.getElementById('dataInicio').value);
  const dataFim = new Date(document.getElementById('dataFim').value);
  if (isNaN(dataInicio) || isNaN(dataFim)) return;

  if (!db) {
    alert('Banco de dados ainda não carregado.');
    return;
  }

  const transReceitas = db.transaction('receitas', 'readonly');
  const storeReceitas = transReceitas.objectStore('receitas');
  const reqReceitas = storeReceitas.getAll();

  reqReceitas.onsuccess = () => {
    const receitas = reqReceitas.result;

    const transDespesas = db.transaction('despesas', 'readonly');
    const storeDespesas = transDespesas.objectStore('despesas');
    const reqDespesas = storeDespesas.getAll();

    reqDespesas.onsuccess = () => {
      const despesas = reqDespesas.result;

      const receitasFiltradas = receitas.filter(r => {
        const d = new Date(r['data-criacao']);
        return d >= dataInicio && d <= dataFim;
      });

      const despesasFiltradas = despesas.filter(d => {
        const data = new Date(d['data-criacao']);
        return data >= dataInicio && data <= dataFim;
      });

      const totalReceitas = receitasFiltradas.reduce((acc, r) => acc + r.valor, 0);
      const totalDespesas = despesasFiltradas.reduce((acc, d) => acc + d.valor, 0);
      const saldo = totalReceitas - totalDespesas;

      document.getElementById('totalReceitas').textContent = `R$ ${totalReceitas.toFixed(2)}`;
      document.getElementById('totalDespesas').textContent = `R$ ${totalDespesas.toFixed(2)}`;
      document.getElementById('saldo').textContent = `R$ ${saldo.toFixed(2)}`;

      const categorias = {};
      despesasFiltradas.forEach(({ categoria, valor }) => {
        categorias[categoria] = (categorias[categoria] || 0) + valor;
      });

      desenharDoughnut(Object.entries(categorias));

      document.getElementById('resultado').hidden = false;
      document.getElementById('linha').hidden = false;
    };

    reqDespesas.onerror = () => console.error('Erro ao carregar despesas');
  };

  reqReceitas.onerror = () => console.error('Erro ao carregar receitas');
});

function desenharDoughnut(data) {
  const svg = document.getElementById('doughnutChart');
  svg.innerHTML = '';
  const total = data.reduce((sum, [_, v]) => sum + v, 0);
  let cumulative = 0;
  const radius = 15.9155;
  const colors = ['#2e4d3c', '#3f5e4c', '#6fa282', '#8fc4a4', '#bfd3c1'];

  data.forEach(([label, value], index) => {
    const percentage = value / total;
    const offset = cumulative * 100;
    const strokeDasharray = `${percentage * 100} ${100 - percentage * 100}`;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', radius);
    circle.setAttribute('cx', '21');
    circle.setAttribute('cy', '21');
    circle.setAttribute('fill', 'transparent');
    circle.setAttribute('stroke', colors[index % colors.length]);
    circle.setAttribute('stroke-width', '6');
    circle.setAttribute('stroke-dasharray', strokeDasharray);
    circle.setAttribute('stroke-dashoffset', offset);
    svg.appendChild(circle);
    cumulative += percentage;
  });

  let labelY = 5;
  data.forEach(([label, value], index) => {
    const percent = ((value / total) * 100).toFixed(0);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '45');
    text.setAttribute('y', labelY);
    text.setAttribute('fill', '#000');
    text.innerHTML = `${percent}% `;
    const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan.setAttribute('fill', colors[index % colors.length]);
    tspan.setAttribute('font-weight', 'bold');
    tspan.textContent = ` ${label}`;
    text.appendChild(tspan);
    svg.appendChild(text);
    labelY += 5;
  });
}