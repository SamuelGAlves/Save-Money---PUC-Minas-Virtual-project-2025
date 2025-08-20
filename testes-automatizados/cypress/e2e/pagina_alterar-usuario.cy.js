import { testOnAllDevicesAndThemes } from '../support/utils';

testOnAllDevicesAndThemes('Página de Alterar Usuário', (device, theme) => {
  beforeEach(() => {
    cy.setViewportByDevice(device);
    cy.createAndLoginUser();
    cy.visit('/user-edit', { failOnStatusCode: false });
    cy.setTheme(theme);

    cy.document().should('have.property', 'readyState', 'complete');
    cy.get('save-money-core', { timeout: 20000 }).should('exist');

    // Aguarda um momento para garantir que todos os elementos estejam carregados
    cy.wait(1000);
  });

  it('deve conseguir alterar usuário', () => {
    cy.get("input#nome").clear().type('Matheus Carlos');
    cy.get("input#senha").clear().type('Teste@123');
    cy.get("input#confirme-senha").clear().type('Teste@123');

    cy.wait(1000);
    cy.takeScreenshotWithContext({
      device,
      theme
    });

    cy.get("button[type='submit']").click({ force: true });
 });
});
