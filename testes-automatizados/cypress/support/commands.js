// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { sanitizeFileName } from './utils';

Cypress.Commands.add('setViewportByDevice', (device) => {
  const devices = {
    mobile: [360, 640],
    tablet: [720, 960],
    desktop: [1280, 720],
  };

  const viewport = devices[device];

  if (Array.isArray(viewport)) {
    cy.viewport(viewport[0], viewport[1]);
  } else {
    cy.viewport(viewport);
  }
});

Cypress.Commands.add('setTheme', (theme) => {
  cy.document().then((doc) => {
    doc.body.classList.remove('light-mode', 'dark-mode');
    doc.body.classList.add(theme);
    localStorage.setItem('darkMode', theme === 'dark-mode' ? 'true' : 'false');
  });
});

// Comando para criar um usuário de teste
Cypress.Commands.add('createTestUser', () => {
  const testUser = {
    nome: 'Usuário Teste',
    email: `teste_${Date.now()}@sga.pucminas.br`,
    documento: '209.737.160-45',
    senha: 'Teste@123'
  };

  // Realiza o cadastro
  cy.visit('/registration', { failOnStatusCode: false });
  cy.wait(1000);
  cy.get('app-input[label="Nome completo"]', { timeout: 5000 }).find('input').type(testUser.nome);
  cy.get('app-input[label="E-mail"]').find('input').type(testUser.email);
  cy.get('app-input[label="Documento"]').find('input').type(testUser.documento);
  cy.get('app-input[label="Senha"]').find('input').type(testUser.senha);
  cy.get('app-input[label="Confirme a senha"]').find('input').type(testUser.senha);
  cy.get('app-checkbox#termos')
    .shadow()
    .find('input[type="checkbox"]')
    .check({ force: true });
  cy.get('app-button#registration-button').find('button').click();

  // Aguarda o cadastro ser concluído
  cy.wait(4000);
  cy.get('.toast').contains('Conta criada com sucesso!').should('exist');

  // Armazena o usuário no localStorage para uso posterior
  cy.window().then((win) => {
    win.localStorage.setItem('testUser', JSON.stringify(testUser));
  });
});

// Comando para fazer login com um usuário
Cypress.Commands.add('loginWithUser', (email, senha) => {
  cy.visit('/login', { failOnStatusCode: false });
  cy.get('app-input[label="E-mail"]').find('input').type(email);
  cy.get('app-input[label="Senha"]').find('input').type(senha);
  cy.get('app-button#login-button').find('button').click();

  // Aguarda o login ser concluído
  cy.get('.toast').contains('Login realizado com sucesso!').should('exist');
  cy.wait(2000);
});

// Comando para criar um usuário e fazer login
Cypress.Commands.add('createAndLoginUser', () => {
  cy.createTestUser();
});

// Comando para obter o usuário de teste atual
Cypress.Commands.add('getTestUser', () => {
  cy.window().then((win) => {
    return JSON.parse(win.localStorage.getItem('testUser'));
  });
});

// Comando para criar screenshot com contexto
Cypress.Commands.add('takeScreenshotWithContext', (options = {}) => {
  const { testName } = options;

  // Obtém o contexto do teste atual de forma segura
  let testTitle = testName;
  let describeContext = '';

  try {
    const currentTest = Cypress.currentTest;
    cy.log('Iniciando captura de screenshot');

    if (currentTest) {
      // Pega o título do teste
      testTitle = testName || currentTest.title;
      cy.log(`Título do teste: ${testTitle}`);

      // Tenta obter o contexto do describe
      if (currentTest.titlePath && currentTest.titlePath.length >= 2) {
        // Remove o [device, theme] do título do describe
        describeContext = currentTest.titlePath[0];
        cy.log(`Contexto do describe: ${describeContext}`);
      }
    }
  } catch (error) {
    cy.log(`Erro: ${error.message}`);
  }

  // Formata o nome do arquivo incluindo o contexto do describe e do it
  const fileName = `${describeContext} -- ${testTitle}`;

  cy.log(`Nome do arquivo: ${fileName}`);

  // Tira o screenshot
  cy.screenshot(fileName, {
    capture: 'viewport',
    ...options
  });
});

Cypress.Commands.add('clickAllToasts', () => {
  cy.get('.toast').each(($toast) => {
    cy.wrap($toast).click();
  });
});
