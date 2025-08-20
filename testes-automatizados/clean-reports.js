const fs = require('fs');
const path = require('path');

// Caminho absoluto para a pasta onde estão os relatórios JSON
const TESTES_DIR = path.join(__dirname, '..', 'codigo-fonte', 'core', 'pages', 'testes');

try {
  // Verifica se o diretório existe
  if (!fs.existsSync(TESTES_DIR)) {
    console.log('Diretório de testes não encontrado:', TESTES_DIR);
    process.exit(0);
  }

  // Lê todos os arquivos no diretório
  const files = fs.readdirSync(TESTES_DIR);

  // Remove arquivos que começam com "testes_" e terminam com ".json"
  files.forEach(file => {
    if (file.startsWith('testes') && file.endsWith('.json')) {
      const filePath = path.join(TESTES_DIR, file);
      fs.unlinkSync(filePath);
      console.log(`Arquivo removido: ${file}`);
    }
  });

  console.log('Limpeza concluída com sucesso!');
} catch (error) {
  console.error('Erro ao limpar arquivos:', error);
  process.exit(1);
}
