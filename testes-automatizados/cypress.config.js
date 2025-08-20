const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    excludeSpecPattern: 'cypress/e2e/all.spec.cy.js',
    trashAssetsBeforeRuns: true,
    experimentalRunAllSpecs: true,
    screenshotsFolder: 'cypress/ignore-files-developer-screenshots',
    includeShadowDom: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
      return config;
    }
  }
});
