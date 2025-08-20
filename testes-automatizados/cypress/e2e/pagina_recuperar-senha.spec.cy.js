import { testOnAllDevicesAndThemes } from '../support/utils';

testOnAllDevicesAndThemes('Página de Recuperar senha', (device, theme) => {
  beforeEach(() => {
    cy.setViewportByDevice(device);
    cy.visit('/esqueceu', { failOnStatusCode: false });
    cy.setTheme(theme);

    cy.document().should('have.property', 'readyState', 'complete');
    cy.get('save-money-core', { timeout: 20000 }).should('exist');

    // Aguarda um momento para garantir que todos os elementos estejam carregados
    cy.wait(1000);
  });

  it('deve mostrar a página de recuperar senha', () => {
    cy.get('remember-page')
      .find('h1')
      .should('exist')
      .and('contains.text', 'Recuperar Senha')

    cy.get('app-input#email')
      .should('exist')

    cy.get('app-button#recover-button')
      .should('exist')
      .and('contains.text', 'Enviar')

    cy.wait(1000);
    cy.takeScreenshotWithContext({
      device,
      theme
    });
  });

  it('deve voltar para página de login ao clicar em "Voltar para login"', () => {
    cy.get('.back-button')
      .should('exist')
      .click({ force: true });

    cy.wait(500);

    cy.get('login-content')
      .find('h1')
      .should('be.visible')
      .and('contain.text', 'Entrar');
  });
});
