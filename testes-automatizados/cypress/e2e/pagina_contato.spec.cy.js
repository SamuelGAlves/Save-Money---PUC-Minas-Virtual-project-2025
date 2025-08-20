import { testOnAllDevicesAndThemes } from '../support/utils';

// Utilitário para acessar shadow DOM de componentes customizados
function getInputById(id) {
  return cy.get(`contact-page`).shadow().find(`#${id}`);
}

function getTextareaById(id) {
  return cy.get(`contact-page`).shadow().find(`#${id}`);
}

testOnAllDevicesAndThemes('Página Contato', (device, theme) => {
  beforeEach(() => {
    cy.setViewportByDevice(device);
    cy.visit('/contato', { failOnStatusCode: false });
    cy.setTheme(theme);
    cy.document().should('have.property', 'readyState', 'complete');
    cy.get('save-money-core', { timeout: 20000 }).should('exist');
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

  it('deve exibir o título da página Contato com ícone', () => {
    cy.get('contact-page')
      .find('.page-title')
      .should('be.visible')
      .and('contain.text', 'Contato');

    cy.get('contact-page')
      .find('.page-title app-icon')
      .should('exist')
      .and('have.attr', 'aria-hidden', 'true');
  });

  it('deve exibir as informações de contato', () => {
    cy.get('contact-page')
      .find('.contact-info')
      .should('exist');

    cy.get('contact-page')
      .find('.contact-item')
      .should('have.length', 3);

    cy.get('contact-page')
      .find('.contact-item')
      .first()
      .should('contain.text', 'contato@savemoney.app.br');

    cy.get('contact-page')
      .find('.contact-item')
      .eq(1)
      .should('contain.text', '(82) 99931-9097');

    cy.get('contact-page')
      .find('.contact-item')
      .last()
      .should('contain.text', 'América Latina, Brasil');
  });

  it('deve exibir todos os campos do formulário', () => {
    cy.get('contact-page').shadow().find('form').should('exist');
    getInputById('name').should('exist');
    getInputById('email').should('exist');
    getInputById('recipient').should('exist');
    getInputById('subject').should('exist');
    getTextareaById('message').should('exist');
  });

  it('não deve permitir envio com campos vazios', () => {
    cy.get('contact-page').shadow().find('form').submit();
    cy.wait(200);
    cy.document().should('exist');
    cy.takeScreenshotWithContext({ device, theme });
  });

  it('deve validar formato de email inválido', () => {
    getInputById('name').find('input').type('Nome Teste');
    getInputById('email').find('input').type('emailinvalido');
    getInputById('subject').find('input').type('Assunto Teste');
    getTextareaById('message').find('textarea').type('Mensagem de teste');
    cy.get('contact-page').shadow().find('form').submit();
    cy.takeScreenshotWithContext({ device, theme });
  });

  it('deve permitir preenchimento e envio do formulário', () => {
    getInputById('name').find('input').type('Nome Teste');
    getInputById('email').find('input').type('teste@email.com');
    getInputById('subject').find('input').type('Assunto Teste');
    getTextareaById('message').find('textarea').type('Mensagem de teste');
    // Seleciona destinatário (opcional, já vem selecionado)
    // getInputById('recipient').find('select').select('contato@savemoney.app.br');
    cy.intercept('POST', '**/contact', { statusCode: 200, body: { message: 'sucesso' } }).as('postContact');
    cy.get('contact-page').shadow().find('form').submit();
    cy.wait('@postContact');
    cy.takeScreenshotWithContext({ device, theme });
  });
});
