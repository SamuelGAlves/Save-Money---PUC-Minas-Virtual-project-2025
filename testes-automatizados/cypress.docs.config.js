const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: '../codigo-fonte/core/pages/testes',
    overwrite: false,
    html: false,
    json: true,
    charts: true,
    reportTitle: 'Relatório de Testes Save Money',
    reportPageTitle: 'Testes Automatizados - Save Money',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: true,
    reportFilename: 'testes',
  },
  e2e: {
    baseUrl: 'http://localhost:4200',
    video: true,
    videoCompression: 32,
    trashAssetsBeforeRuns: true,
    screenshotsFolder: '../documentos/testes/screenshots',
    videosFolder: '../documentos/testes/videos',
    screenshotOnRunFailure: true,
    includeShadowDom: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          return null;
        }
      });
      return config;
    }
  },
});
