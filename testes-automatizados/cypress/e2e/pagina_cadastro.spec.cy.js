import { testOnAllDevicesAndThemes } from '../support/utils';

testOnAllDevicesAndThemes('Página de Cadastro', (device, theme) => {
  beforeEach(() => {
    // Configura o viewport e tema
    cy.setViewportByDevice(device);
    cy.setTheme(theme);

    // Visita a página
    cy.visit('/registration', { failOnStatusCode: false });

    cy.document().should('have.property', 'readyState', 'complete');
    cy.get('save-money-core', { timeout: 20000 }).should('exist');

    // Aguarda um momento para garantir que todos os elementos estejam carregados
    cy.wait(1000);
  });

  it('deve exibir o título Cadastro', () => {
    cy.get('registration-content')
      .find('h1')
      .should('be.visible')
      .and('contain.text', 'Criar Conta');
  });

  it('deve exibir os campos obrigatórios', () => {
    cy.get('app-input[label="Nome completo"]').find('input').should('exist');
    cy.get('app-input[label="E-mail"]').find('input').should('exist');
    cy.get('app-input[label="Documento"]').find('input').should('exist');
    cy.get('app-input[label="Senha"]').find('input').should('exist');
    cy.get('app-input[label="Confirme a senha"]').find('input').should('exist');
    cy.get('#termos').should('exist');
  });

  it('deve exibir o botão Cadastrar', () => {
    cy.get('app-button#registration-button')
      .should('contain.text', 'Criar Conta');
  });

  it('não deve permitir cadastro com campos vazios', () => {
    cy.get('app-button#registration-button')
      .find('button')
      .click();

    cy.get('.toast')
      .contains('Preencha todos os campos para continuar.')
      .should('exist')
      .and('be.visible');

    cy.wait(2000);
    cy.takeScreenshotWithContext({
      device,
      theme
    });
  });

  it('deve exibir erro ao tentar cadastrar com senhas diferentes', () => {
    cy.get('app-input[label="Nome completo"]').find('input').type('Usuário Teste');
    cy.get('app-input[label="E-mail"]').find('input').type('teste@teste.com');
    cy.get('app-input[label="Documento"]').find('input').type('209.737.160-45');
    cy.get('app-input[label="Senha"]').find('input').type('Teste@123');
    cy.get('app-input[label="Confirme a senha"]').find('input').type('654321');
    cy.get('app-checkbox#termos')
      .shadow()
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get('app-button#registration-button')
      .find('button')
      .click({ force: true });

    cy.get('.toast')
      .contains('As senhas não coincidem')
      .should('exist')
      .and('be.visible');

    cy.wait(2000);
    cy.takeScreenshotWithContext({
      device,
      theme
    });
  });

  it('deve cadastrar usuário com sucesso e permitir login', () => {
    const nome = 'Lucas Ferreira';
    const email = `lucas_ferreira_${Date.now()}@sga.pucminas.br`;
    const documento = '209.737.160-45';
    const senha = 'Teste@123';

    cy.wait(1000);

    // Cadastro
    cy.get('app-input[label="Nome completo"]', { timeout: 500 }).find('input').type(nome);
    cy.get('app-input[label="E-mail"]').find('input').type(email);
    cy.get('app-input[label="Documento"]').find('input').type(documento);
    cy.get('app-input[label="Senha"]').find('input').type(senha);
    cy.get('app-input[label="Confirme a senha"]').find('input').type(senha);
    cy.get('app-checkbox#termos')
      .shadow()
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.takeScreenshotWithContext({
      device,
      theme,
      testName: 'deve cadastrar usuário com sucesso'
    });

    cy.get('app-button#registration-button').find('button').click({ force: true });

    cy.wait(5500);

    cy.get('.toast')
      .contains('Conta criada com sucesso!')
      .should('exist')
      .and('be.visible');

    cy.get('.toast')
      .contains('Login realizado com sucesso!')
      .should('exist')
      .and('be.visible');

    cy.wait(100);

    cy.takeScreenshotWithContext({
      device,
      theme,
      testName: 'deve permitir login com sucesso'
    });
  });
});
