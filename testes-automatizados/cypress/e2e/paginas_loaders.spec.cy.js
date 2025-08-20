import { testOnAllDevicesAndThemes } from '../support/utils';

testOnAllDevicesAndThemes('Loaders nas Páginas', (device, theme) => {
  beforeEach(() => {
    cy.setViewportByDevice(device);
    cy.setTheme(theme);
  });

  it('deve exibir loader na página de login ao tentar fazer login', () => {
    cy.visit('/login', { failOnStatusCode: false });
    cy.document().should('have.property', 'readyState', 'complete');
    cy.get('save-money-core', { timeout: 20000 }).should('exist');


    cy.wait(1000);

    // Preenche o formulário de login
    cy.get('app-input[label="E-mail"]', { timeout: 5000 }).find('input').type('teste@teste.com');
    cy.get('app-input[label="Senha"]').find('input').type('senha123');

    // Clica no botão de login
    cy.get('app-button#login-button')
      .find('button')
      .click({ force: true });

    // Verifica se o loader aparece durante a tentativa de login
    cy.get('app-loader', { timeout: 5000 })
      .should('exist')
      .and('be.visible');

    cy.takeScreenshotWithContext({
      device,
      theme,
      name: 'loader-pagina-login'
    });

    cy.get('app-loader', { timeout: 10000 }).should('not.exist');
  });

  it('deve exibir loader na página de cadastro', () => {
    cy.visit('/registration', { failOnStatusCode: false });
    cy.document().should('have.property', 'readyState', 'complete');
    cy.get('save-money-core', { timeout: 20000 }).should('exist');

    const nome = 'Lucas Ferreira';
    const email = `lucas_ferreira_${Date.now()}@sga.pucminas.br`;
    const documento = '209.737.160-45';
    const senha = 'Teste@123';

    cy.wait(1000);

    // Cadastro
    cy.get('app-input[label="Nome completo"]').find('input').type(nome);
    cy.get('app-input[label="E-mail"]').find('input').type(email);
    cy.get('app-input[label="Documento"]').find('input').type(documento);
    cy.get('app-input[label="Senha"]').find('input').type(senha);
    cy.get('app-input[label="Confirme a senha"]').find('input').type(senha);
    cy.get('app-checkbox#termos')
      .shadow()
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get('app-button#registration-button').find('button').click();

    cy.get('app-loader', { timeout: 10000 })
      .should('exist')
      .and('be.visible');

    cy.takeScreenshotWithContext({
      device,
      theme,
      name: 'loader-pagina-cadastro'
    });

    cy.get('app-loader', { timeout: 10000 }).should('not.exist');
  });
});
