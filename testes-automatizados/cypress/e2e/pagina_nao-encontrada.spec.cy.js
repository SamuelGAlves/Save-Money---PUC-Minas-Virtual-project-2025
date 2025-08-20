import { testOnAllDevicesAndThemes } from '../support/utils';

testOnAllDevicesAndThemes('Página não encontrada', (device, theme) => {
  beforeEach(() => {
    cy.setViewportByDevice(device);
    cy.visit('/pagina-inexistente', { failOnStatusCode: false });
    cy.setTheme(theme);

    cy.document().should('have.property', 'readyState', 'complete');
    cy.get('save-money-core', { timeout: 20000 }).should('exist');

    // Aguarda um momento para garantir que todos os elementos estejam carregados
    cy.wait(1000);
  });

  it('deve mostrar a página não encontrada para usuário não autenticado', () => {
    cy.get('.not-auth-container').should('exist');
    cy.get('save-money-logo[size="large"]').should('exist');
    cy.get('dark-mode-toggle').should('exist');

    cy.get('.error-code')
      .should('exist')
      .and('contain.text', '404');

    cy.get('.page-title')
      .should('exist')
      .and('contain.text', 'Página não encontrada');

    cy.get('.description')
      .should('exist')
      .and('contain.text', 'Ops! Parece que você se perdeu.');

    cy.get('app-button[href="/login"]')
      .should('exist')
      .and('contain.text', 'Entrar');

    cy.wait(1000);
    cy.takeScreenshotWithContext({
      device,
      theme
    });
  });

  it('deve redirecionar para a página de login ao clicar no botão', () => {
    cy.get('app-button[href="/login"]')
      .should('exist')
      .find('button')
      .click({ force: true });

    cy.wait(500);

    cy.get('login-content')
      .find('h1')
      .should('be.visible')
      .and('contain.text', 'Entrar');
  });

  it('deve mostrar a página não encontrada para usuário autenticado', () => {
    cy.createAndLoginUser();
    cy.visit('/pagina-inexistente', { failOnStatusCode: false });

    cy.get('.container').should('exist');

    cy.get('.page-title')
      .should('exist')
      .and('contain.text', 'Página não encontrada');

    cy.wait(1000);
    cy.takeScreenshotWithContext({
      device,
      theme,
      suffix: 'authenticated'
    });
  });
});
