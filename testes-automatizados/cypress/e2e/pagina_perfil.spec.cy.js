import { testOnAllDevicesAndThemes } from '../support/utils';

testOnAllDevicesAndThemes('Página de Perfil', (device, theme) => {
  beforeEach(() => {
    cy.setViewportByDevice(device);
    cy.createAndLoginUser();
    cy.visit('/perfil', { failOnStatusCode: false });
    cy.setTheme(theme);
    cy.document().should('have.property', 'readyState', 'complete');
    cy.get('save-money-core', { timeout: 20000 }).should('exist');
    cy.wait(1000);
  });

  it('deve exibir informações básicas do usuário', () => {
    cy.get('profile-page').shadow().find('.profile-title').should('exist').and('not.be.empty');
    cy.get('profile-page').shadow().find('.profile-subtitle').should('exist').and('not.be.empty');
    cy.get('profile-page').shadow().find('.info-item').should('exist');
    cy.get('profile-page').shadow().find('.actions-section').should('exist');
  });

  it('deve conseguir acessar página de perfil pelo menu', () => {
    cy.get('app-navbar').shadow().find('app-link[href="/perfil"], .nav-link[href="/perfil"]')
      .should('exist')
      .and('contain.text', 'Perfil')
      .click({ force: true });
    cy.wait(1000);
    cy.get('profile-page').should('exist');
    cy.takeScreenshotWithContext({
      device,
      theme
    });
  });

  it('deve conseguir deletar o usuário', () => {
    cy.get('profile-page').shadow().find('#deleteAccountBtn')
      .should('exist')
      .and('contains.text', 'Excluir Conta')
      .click({ force: true });
    cy.wait(1000);
    cy.takeScreenshotWithContext({
      device,
      theme,
      testName: 'modal deletar usuário'
    });
    cy.get('profile-page').shadow().find('confirm-delete-user-modal').shadow().find('app-button#confirm')
      .should('exist')
      .and('contains.text', 'Excluir Conta')
      .click({ force: true });
    cy.wait(4000);
    cy.get('.toast')
      .contains('Conta excluída com sucesso!')
      .should('exist')
      .and('be.visible');
    cy.takeScreenshotWithContext({
      device,
      theme,
      testName: 'usuário deletado com sucesso'
    });
  });

  it('deve conseguir mostrar modal de sair e deslogar com sucesso', () => {
    cy.get('app-navbar').shadow().find('#logoutBtn')
      .should('exist')
      .and('contain.text', 'Sair')
      .click({ force: true });
    cy.wait(1000);
    cy.get('profile-page').shadow().find('logout-modal').shadow().find('app-button#confirm')
      .should('exist')
      .and('contains.text', 'Sair')
      .click({ force: true });
    cy.takeScreenshotWithContext({
      device,
      theme,
      testName: 'modal deslogar usuário'
    });
  });
});
