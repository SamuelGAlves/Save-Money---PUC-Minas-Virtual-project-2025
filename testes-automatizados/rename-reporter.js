const path = require('path');
const fs = require('fs');

const origem = path.join(__dirname, '..', 'codigo-fonte', 'testes', 'testes.html');
const destino = path.join(__dirname, '..', 'codigo-fonte', 'testes', 'index.html');

fs.rename(origem, destino, (err) => {
  if (err) {
    console.error('❌ Erro ao renomear o arquivo:', err);
    process.exit(1);
  } else {
    console.log('✅ Arquivo renomeado com sucesso para index.html');
  }
});
