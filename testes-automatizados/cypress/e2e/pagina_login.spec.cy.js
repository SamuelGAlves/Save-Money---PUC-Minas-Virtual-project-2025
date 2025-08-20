import { testOnAllDevicesAndThemes } from '../support/utils';

testOnAllDevicesAndThemes('Página de Login', (device, theme) => {
  beforeEach(() => {
    cy.setViewportByDevice(device);
    cy.visit('/login', { failOnStatusCode: false });
    cy.setTheme(theme);

    cy.document().should('have.property', 'readyState', 'complete');
    cy.get('save-money-core', { timeout: 20000 }).should('exist');

    // Aguarda um momento para garantir que todos os elementos estejam carregados
    cy.wait(1000);
  });

  it('deve exibir a logo com texto Save Money', () => {
    cy.get('save-money-logo')
      .find('.title')
      .should('have.text', 'Save Money');
  });

  it('deve exibir o subtitulo PUC Minas Tecnologia', () => {
    cy.get('save-money-logo')
      .find('.subtitle')
      .should('have.text', 'PUC Minas Tecnologia');
  });

  it('deve exibir o componente de darkmode', () => {
    cy.get('dark-mode-toggle')
      .should('exist');
  });

  it('deve exibir o título Login', () => {
    cy.get('login-content')
      .find('h1')
      .should('be.visible')
      .and('contain.text', 'Entrar');
  });

  it('deve exibir os campos de e-mail e senha', () => {
    cy.get('app-input[label="E-mail"]')
      .find('input')
      .should('exist');

    cy.get('app-input[label="Senha"]')
      .find('input')
      .should('exist');
  });

  it('deve exibir o botão Entrar', () => {
    cy.get('app-button#login-button')
      .should('contain.text', 'Entrar');
  });

  it('deve exibir o botão registrar', () => {
    cy.get('app-button[href="/registration"][variant="secondary"]')
      .should('contain.text', 'Registrar')
      .find('app-icon')
      .should('exist');
  });

  it('deve exibir o link de recuperação de senha', () => {
    cy.get('login-content')
      .find('app-link')
      .contains('Clique aqui')
      .should('have.attr', 'href')
      .and('include', '/esqueceu');
  });

  it('não deve permitir login com campos vazios', () => {
    cy.get('app-button#login-button')
      .find('button')
      .click();

    cy.wait(2000);
    cy.get('.toast')
      .contains('Preencha todos os campos para continuar.')
      .should('exist')
      .and('be.visible');

    cy.takeScreenshotWithContext({
      device,
      theme,
    });
  });

  it('deve exibir erro ao tentar login inválido', () => {
    cy.get('app-input[label="E-mail"]')
      .find('input')
      .type('usuario@invalido.com');

    cy.get('app-input[label="Senha"]')
      .find('input')
      .type('senhaerrada');

    cy.get('app-button#login-button')
      .find('button')
      .click();

    cy.wait(2000);
    cy.get('.toast')
      .contains('Usuário ou senha inválidos')
      .should('exist')
      .and('be.visible');

    cy.takeScreenshotWithContext({
      device,
      theme,
    });
  });
});
