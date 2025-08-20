import { testOnAllDevicesAndThemes } from '../support/utils';

const today = new Date().toISOString().split('T')[0];

testOnAllDevicesAndThemes('Página de Investimentos', (device, theme) => {
  beforeEach(() => {
    cy.setViewportByDevice(device);
    cy.createAndLoginUser();
    cy.visit('/investimentos', { failOnStatusCode: false });
    cy.setTheme(theme);
    cy.document().should('have.property', 'readyState', 'complete');
    cy.get('save-money-core', { timeout: 20000 }).should('exist');
    cy.wait(1000);
  });

  it('deve exibir o titulo Investimentos e investimentos vazios', () => {
    cy.wait(1000);

    cy.get('investments-page').shadow()
      .find('investimento-header').shadow()
      .find('h1')
      .should('contain.text', 'Investimentos')
      .and('be.visible');

    cy.get('investments-page').shadow().find('investment-list')
      .should('exist')
      .invoke('attr', 'message')
      .should('contain', 'Não há investimentos cadastrados.');

    cy.wait(1000);
    cy.takeScreenshotWithContext({ device, theme });
  });

  it('deve exibir o modal de adicionar investimento', () => {
    cy.get('investments-page').find('investimento-header')
      .find('app-button[aria-label="Adicionar novo item"]')
      .click({ force: true });

    cy.get('investments-page').find('investment-modal')
      .should('exist');

    cy.wait(1000);

    cy.takeScreenshotWithContext({ device, theme });
  });

  it('deve exibir o modal de adicionar investimento preenchido e adicionar um investimento com sucesso', () => {
    cy.get('investments-page').shadow().find('investimento-header')
      .find('app-button[aria-label="Adicionar novo item"]')
      .click({ force: true });

    cy.wait(1000);

    cy.get('investments-page').shadow().find('investment-modal')
      .should('exist')
      .within(() => {
        cy.get('input#title').type('Investimento Teste');
        cy.get('input#value').type('1000.00', { force: true });
      });
    cy.wait(1000);
    cy.takeScreenshotWithContext({
      device,
      theme,
      testName: 'deve exibir o modal de adicionar investimento preenchido'
    });
    cy.get('investments-page')
      .find('investment-modal')
      .find('app-button#save')
      .first()
      .click({ force: true });
    cy.wait(1000);

    cy.get('investments-page').shadow().find('investment-list')
      .should('exist')
      .invoke('attr', 'message')
      .should('not.contain', 'Não há investimentos cadastrados.');
    cy.get('investments-page').shadow().find('investment-list')
      .invoke('attr', 'investments')
      .then((investmentsStr) => {
        const investments = JSON.parse(investmentsStr);
        const inv = investments.find(i => i.title === 'Investimento Teste');
        expect(inv).to.exist;
        expect(inv.value).to.equal(1000);
        expect(inv.date).to.equal(today);
        expect(inv.interestRate).to.equal(0);
        expect(inv.interestType).to.equal('none');
      });
    cy.takeScreenshotWithContext({
      device,
      theme,
      testName: 'deve adicionar um investimento com sucesso'
    });
  });
});
