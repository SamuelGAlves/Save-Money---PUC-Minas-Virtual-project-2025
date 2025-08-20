import toast from '../../services/toast.js';
import { loaderService } from '../../services/loader.js';

class TestesPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.testData = null;
  }

  async connectedCallback() {
    try {
      loaderService.show('Carregando testes...');
      await this.loadTestData();
      this.render();
      this.setupEventListeners();
    } catch (error) {
      console.error('Erro ao carregar dados dos testes:', error);
    } finally {
      loaderService.hide();
    }
  }

  setupEventListeners() {
    const testItems = this.shadowRoot.querySelectorAll('.test-item');
    const testSuites = this.shadowRoot.querySelectorAll('.test-suite');

    testItems.forEach(item => {
      const header = item.querySelector('.test-header');
      header.addEventListener('click', () => {
        // Colapsa todos os outros testes
        testItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector('.test-content');
            const otherIcon = otherItem.querySelector('.test-toggle-icon');
            otherContent.classList.add('collapsed');
            otherIcon.textContent = 'add';
          }
        });

        // Toggle do teste atual
        const content = item.querySelector('.test-content');
        const icon = item.querySelector('.test-toggle-icon');
        content.classList.toggle('collapsed');
        icon.textContent = content.classList.contains('collapsed') ? 'add' : 'remove';

        // Se estiver expandindo, faz o scroll após a animação
        if (!content.classList.contains('collapsed')) {
          setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300); // Aguarda o tempo da animação
        }
      });
    });

    testSuites.forEach(suite => {
      const header = suite.querySelector('.test-suite-header');
      header.addEventListener('click', () => {
        // Colapsa todas as outras suites
        testSuites.forEach(otherSuite => {
          if (otherSuite !== suite) {
            const otherContent = otherSuite.querySelector('.test-suite-content');
            const otherIcon = otherSuite.querySelector('app-icon.suite-toggle-icon');
            const otherFolderIcon = otherSuite.querySelector('app-icon[aria-hidden="true"]');
            otherContent.classList.add('collapsed');
            otherIcon.textContent = 'unfold_more';
            otherFolderIcon.textContent = 'folder';
          }
        });

        // Toggle da suite atual
        const content = suite.querySelector('.test-suite-content');
        const icon = suite.querySelector('app-icon.suite-toggle-icon');
        const folderIcon = suite.querySelector('app-icon[aria-hidden="true"]');
        content.classList.toggle('collapsed');
        const newIcon = content.classList.contains('collapsed') ? 'unfold_more' : 'unfold_less';
        icon.textContent = newIcon;
        folderIcon.textContent = content.classList.contains('collapsed') ? 'folder' : 'folder_open';

        // Se estiver expandindo, faz o scroll após a animação
        if (!content.classList.contains('collapsed')) {
          setTimeout(() => {
            suite.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300); // Aguarda o tempo da animação
        }
      });
    });
  }

  async loadTestData() {
    try {
      const testDataPromises = [];
      const maxAttempts = 100; // Limite máximo de tentativas para evitar loop infinito
      let foundFiles = 0;

      // Primeiro tenta carregar testes.json
      try {
        const response = await fetch('../codigo-fonte/core/pages/testes/testes.json');
        console.log('Tentando carregar testes.json:', response);
        if (response.ok) {
          const text = await response.text();
          console.log('Conteúdo de testes.json:', text);
          try {
            const json = JSON.parse(text);
            testDataPromises.push(Promise.resolve(json));
            foundFiles++;
          } catch (jsonError) {
            console.error('Erro ao fazer parse do testes.json:', jsonError);
          }
        } else {
          console.warn('testes.json não encontrado ou não está ok:', response.status);
        }
      } catch (error) {
        console.error('Erro ao tentar buscar testes.json:', error);
      }

      // Depois tenta carregar os arquivos numerados
      let fileNumber = 1;
      while (fileNumber <= maxAttempts) {
        const paddedNumber = fileNumber.toString().padStart(3, '0');
        const filePath = `../codigo-fonte/core/pages/testes/testes_${paddedNumber}.json`;

        try {
          const response = await fetch(filePath);
          console.log(`Tentando carregar ${filePath}:`, response);
          if (!response.ok) {
            if (fileNumber === 1 && foundFiles === 0) {
              toast.error('Nenhum arquivo de teste encontrado');
              this.testData = null;
              this.render();
              return;
            }
            break; // Se o arquivo não existe, para o loop
          }
          const text = await response.text();
          console.log(`Conteúdo de ${filePath}:`, text);
          try {
            const json = JSON.parse(text);
            testDataPromises.push(Promise.resolve(json));
            foundFiles++;
            fileNumber++;
          } catch (jsonError) {
            console.error(`Erro ao fazer parse de ${filePath}:`, jsonError);
            break;
          }
        } catch (error) {
          if (fileNumber === 1 && foundFiles === 0) {
            toast.error('Erro ao carregar arquivos de teste');
            this.testData = null;
            this.render();
            return;
          }
          console.error(`Erro ao tentar buscar ${filePath}:`, error);
          break; // Se houver erro ao carregar, para o loop
        }
      }

      if (foundFiles === 0) {
        toast.error('Nenhum arquivo de teste encontrado');
        this.testData = null;
        this.render();
        return;
      }

      try {
        const testDataResults = await Promise.all(testDataPromises);
        this.testData = {
          stats: this.aggregateStats(testDataResults),
          results: testDataResults.flatMap(data => data.results || [])
        };
      } catch (error) {
        toast.error('Erro ao processar dados dos testes');
        console.error('Erro ao processar dados dos testes:', error);
        this.testData = null;
      }
    } catch (error) {
      console.error('Erro ao carregar dados dos testes:', error);
      this.testData = null;
    } finally {
      this.render();
    }
  }

  aggregateStats(testDataResults) {
    return testDataResults.reduce((acc, data) => {
      const stats = data.stats;
      return {
        tests: (acc.tests || 0) + stats.tests,
        passes: (acc.passes || 0) + stats.passes,
        failures: (acc.failures || 0) + stats.failures,
        passPercent: Math.round(((acc.passes || 0) + stats.passes) / ((acc.tests || 0) + stats.tests) * 100)
      };
    }, {});
  }

  hasScreenshot(code) {
    return code && typeof code === 'string' && code.includes('cy.takeScreenshotWithContext');
  }

  getTestNameFromCode(code) {
    if (!code) return null;

    // Procura por testName no código
    const testNameMatch = code.match(/testName:\s*['"]([^'"]+)['"]/);
    if (testNameMatch) {
      return testNameMatch[1];
    }
    return null;
  }

  findSuiteTitle(suiteUUID) {
    if (!this.testData?.results) return { title: '', file: '' };

    // Procura o título da suite nos resultados
    for (const result of this.testData.results) {
      if (!result?.suites) continue;

      for (const suite of result.suites) {
        if (suite?.uuid === suiteUUID) {
          return {
            title: suite.title || '',
            file: result.file || ''
          };
        }
      }
    }
    return { title: '', file: '' };
  }

  getDeviceAndThemeFromTitle(title, testState) {
    if (!title) return { device: 'mobile', theme: 'light-mode' };

    // Se o teste falhou, retorna desktop
    if (testState === 'failed') {
      return { device: 'desktop', theme: 'light-mode' };
    }

    // Procura por device e theme no título
    const deviceMatch = title.match(/\[(mobile|tablet|desktop)/i);
    const themeMatch = title.match(/,\s*(light-mode|dark-mode)\]/i);

    return {
      device: deviceMatch ? deviceMatch[1].toLowerCase() : 'mobile',
      theme: themeMatch ? themeMatch[1].toLowerCase() : 'light-mode'
    };
  }

  getBasePath() {
    const isGitHubPages = self.location.origin === 'https://icei-puc-minas-pmv-ads.github.io';
    const pathParts = self.location.pathname.split('/');

    // Remove partes vazias do array
    const cleanParts = pathParts.filter(part => part !== '');

    if (isGitHubPages) {
      // Encontra o índice do repositório no caminho
      const repoIndex = cleanParts.indexOf('pmv-ads-2025-1-e1-proj-web-t6-v2-pmv-ads-2025-1-e1-proj-savemoney');
      if (repoIndex !== -1) {
        // Pega todas as partes até o repositório + documentos
        const relevantParts = cleanParts.slice(0, repoIndex + 1);
        return '/' + relevantParts.join('/') + '/documentos';
      }
      // Se não encontrar o repositório, usa a primeira parte do caminho
      return `/${cleanParts[0]}/documentos`;
    }

    // Para ambiente local, sempre retorna '/documentos'
    return '/documentos';
  }

  getScreenshotPath(test) {
    if (!this.hasScreenshot(test?.code)) return null;

    // Função para extrair o nome do arquivo do caminho
    const getFileNameFromPath = (filePath) => {
      if (!filePath) return '';
      // Remove barras invertidas e normais, pega apenas o nome do arquivo
      return filePath.split(/[\/\\]/).pop();
    };

    // Pega o contexto do describe (suite.title) e o título do teste
    const suiteInfo = test?.parentUUID ? this.findSuiteTitle(test.parentUUID) : { title: '', file: '' };
    const testTitle = test?.title || '';

    // Verifica se existe testName no código
    const testName = this.getTestNameFromCode(test?.code);
    const formattedTestTitle = testName || testTitle;

    // Formata o nome do arquivo incluindo o contexto do describe e do it
    const fileName = `${suiteInfo.title} -- ${formattedTestTitle}${test.state === 'failed' ? ' (failed)' : ''}`;

    // Pega o nome do arquivo de teste
    const testFileName = getFileNameFromPath(suiteInfo.file);

    // Constrói o caminho da imagem seguindo o padrão da função takeScreenshotWithContext
    return `${this.getBasePath()}/testes/screenshots/${testFileName}/${fileName}.png`;
  }

  render() {
    if (!this.testData || !this.testData.results) {
      this.shadowRoot.innerHTML = `
        <style>
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            text-align: center;
            color: var(--text-muted-color);
          }

          .error-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
        </style>
        <div class="error-container">
          <app-icon class="error-icon" color="error">error_outline</app-icon>
          <p>Não foi possível carregar os dados dos testes</p>
        </div>
      `;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          width: 100%;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--text-color);
        }

        .testes-container {
          display: flex;
          flex-direction: column;
          padding: 2rem;
          border-radius: 1rem;
          width: 100%;
        }

        .page-title {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          margin-top: 0;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stats-card {
          background: var(--background-card-color);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .stat-item {
          text-align: center;
          padding: 15px;
          border-radius: 8px;
          background: var(--background-color);
          transition: transform 0.2s;
        }

        .stat-item:hover {
          transform: translateY(-2px);
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-muted-color);
          margin-top: 5px;
        }

        .test-suite {
          background: var(--background-card-color);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .test-suite-header {
          font-size: 18px;
          font-weight: bold;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .test-suite-content {
          transition: all 0.3s ease-out;
          overflow: hidden;
          opacity: 1;
          max-height: 2000px;
          margin-top: 1rem;
        }

        .test-suite-content.collapsed {
          max-height: 0;
          margin: 0;
          opacity: 0;
          padding: 0;
        }

        .test-item {
          padding: 12px;
          border-left: 4px solid var(--color-success);
          margin-top: 8px;
          background: var(--background-color);
          border-radius: 4px;
          transition: transform 0.2s;
        }

        .test-item:hover {
          transform: translateX(4px);
        }

        .test-item.failed {
          border-left-color: var(--color-danger);
        }

        .test-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          user-select: none;
        }

        .test-title {
          font-weight: 500;
          margin-bottom: 4px;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .test-content {
          transition: all 0.3s ease-out;
          overflow: hidden;
          margin-top: 8px;
          opacity: 1;
          max-height: 2000px;
        }

        .test-content.collapsed {
          max-height: 0;
          margin: 0;
          opacity: 0;
          padding: 0;
        }

        .test-duration {
          font-size: 12px;
          color: var(--text-muted-color);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .test-code {
          background: var(--background-color);
          padding: 12px;
          border-radius: 4px;
          margin-top: 8px;
          font-family: monospace;
          white-space: pre-wrap;
          font-size: 12px;
          color: var(--text-muted-color);
        }

        .test-screenshot {
          margin: 8px 0;
          padding: 10px;
          border-radius: 8px;
        }

        .test-screenshot img {
          width: calc(100% - 20px);
          height: auto;
          display: block;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border: 10px solid var(--border-color);
        }

        .test-screenshot img[data-device="mobile"] {
          max-width: 360px;
          margin: 0 auto;
        }

        .test-screenshot img[data-device="tablet"] {
          max-width: 720px;
          margin: 0 auto;
        }

        .test-screenshot img[data-device="desktop"] {
          max-width: 1280px;
          margin: 0 auto;
        }

        .test-toggle-icon,
        .suite-toggle-icon {
          transition: all 0.3s ease;
        }

        .suite-toggle-icon { margin-left: auto; }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .page-title {
            font-size: 1.5rem;
          }
        }
      </style>

      <div class="testes-container">
        <h1 class="page-title">
          <app-icon aria-hidden="true">assessment</app-icon>
          Relatório de Testes
        </h1>

        <div class="stats-card">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">
                <app-icon color="success">check_circle</app-icon>
                ${this.testData.stats?.tests || 0}
              </div>
              <div class="stat-label">Total de Testes</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">
                <app-icon color="success">task_alt</app-icon>
                ${this.testData.stats?.passes || 0}
              </div>
              <div class="stat-label">Testes Passados</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">
                <app-icon color="error">error</app-icon>
                ${this.testData.stats?.failures || 0}
              </div>
              <div class="stat-label">Falhas</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">
                <app-icon color="info">percent</app-icon>
                ${this.testData.stats?.passPercent || 0}%
              </div>
              <div class="stat-label">Taxa de Sucesso</div>
            </div>
          </div>
        </div>

        ${this.testData.results.map(result => `
          ${result.suites?.map(suite => `
            <div class="test-suite">
              <div class="test-suite-header">
                <app-icon aria-hidden="true">folder</app-icon>
                ${suite.title}
                <app-icon class="suite-toggle-icon">unfold_more</app-icon>
              </div>
              <div class="test-suite-content collapsed">
                ${suite.tests?.map(test => `
                  <div class="test-item ${test.state === 'failed' ? 'failed' : ''}">
                    <div class="test-header">
                      <div class="test-title">
                        <app-icon color="${test.state === 'failed' ? 'error' : 'success'}">
                          ${test.state === 'failed' ? 'error' : 'check_circle'}
                        </app-icon>
                        ${test.title}
                      </div>
                      <app-icon class="test-toggle-icon collapsed">add</app-icon>
                    </div>
                    <div class="test-content collapsed">
                      <div class="test-duration">
                        <app-icon size="small" color="info">schedule</app-icon>
                        Duração: ${test.duration}ms
                      </div>
                      ${this.hasScreenshot(test.code) ? `
                        <div class="test-screenshot">
                          <img src="${this.getScreenshotPath(test)}"
                               alt="Screenshot do teste ${test.title}"
                               data-device="${this.getDeviceAndThemeFromTitle(suite.title, test.state).device}" />
                        </div>
                      ` : ''}
                      ${test.code ? `
                        <div class="test-code">${test.code}</div>
                      ` : ''}
                    </div>
                  </div>
                `).join('') || ''}
              </div>
            </div>
          `).join('') || ''}
        `).join('') || ''}
      </div>
    `;
  }
}

if (!customElements.get('testes-page')) {
  customElements.define('testes-page', TestesPage);
}

export default TestesPage;
