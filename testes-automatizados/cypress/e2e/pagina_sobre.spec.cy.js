import { testOnAllDevicesAndThemes } from '../support/utils';

testOnAllDevicesAndThemes('Página Sobre', (device, theme) => {
  beforeEach(() => {
    cy.setViewportByDevice(device);
    cy.visit('/sobre', { failOnStatusCode: false });
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

  it('deve exibir página Sobre com ícones e seções', () => {
    cy.get('about-page')
      .find('.page-title')
      .should('be.visible');

    cy.get('about-page')
      .find('.page-title app-icon')
      .should('exist')
      .and('have.attr', 'aria-hidden', 'true');

    cy.get('about-page')
      .find('.mission-section')
      .should('be.visible');

    cy.get('about-page')
      .find('.features')
      .should('be.visible');

    cy.get('about-page')
      .find('.team-section')
      .should('be.visible');

    cy.get('about-page')
      .find('.puc-section')
      .should('be.visible');

    cy.get('about-page')
      .find('.assistentes-section')
      .should('be.visible');

    cy.get('about-page')
      .find('.microfund-section')
      .should('be.visible');

    cy.takeScreenshotWithContext({
      device,
      theme,
    });
  });

  it('deve exibir a seção de missão', () => {
    cy.get('about-page')
      .find('.mission-section')
      .should('be.visible')
      .within(() => {
        cy.get('.mission-title').should('exist');
        cy.get('p').should('be.visible');
      });
  });

  it('deve exibir as features do sistema', () => {
    cy.get('about-page')
      .find('.features')
      .should('be.visible')
      .within(() => {
        cy.get('.feature-item')
          .should('have.length', 9);
      });
  });

  it('deve exibir a seção da equipe', () => {
    cy.get('about-page')
      .find('.team-section')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('.team-title').should('exist');
        cy.get('p').should('have.length.at.least', 2);
        cy.get('team-section').should('exist');
      });
  });

  it('deve exibir a seção PUC Minas', () => {
    cy.get('about-page')
      .find('.puc-section')
      .should('be.visible')
      .within(() => {
        cy.get('.puc-header').should('exist');
        cy.get('.puc-logo').should('exist');
        cy.get('.puc-title').should('exist');
        cy.get('.puc-description').should('exist');
        cy.get('.puc-leaders').should('exist');
      });
  });

  it('deve exibir a seção de assistentes', () => {
    cy.get('about-page')
      .find('.assistentes-section')
      .should('be.visible')
      .within(() => {
        cy.get('.section-title').should('exist');
        cy.get('.puc-leaders').should('exist');
        cy.get('.puc-leader').should('have.length.at.least', 1);
      });
  });

  it('deve exibir a seção microfund', () => {
    cy.get('about-page')
      .find('.microfund-section')
      .should('be.visible')
      .within(() => {
        cy.get('.section-title').should('exist');
        cy.get('.puc-leaders').should('exist');
        cy.get('.puc-leader').should('have.length.at.least', 1);
      });
  });
});
