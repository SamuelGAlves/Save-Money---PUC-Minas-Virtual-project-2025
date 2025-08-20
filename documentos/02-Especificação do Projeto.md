# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. É composta pela definição do diagrama de personas, histórias de usuários, requisitos funcionais e não funcionais, além das restrições do projeto.

## Perfis de Usuários

### Perfil Pessoa Física
**Descrição:**  
Pessoas que desejam melhorar sua vida financeira.  

**Necessidades:**  
Controle de despesas, planejamento de orçamento, acompanhamento de metas financeiras.  

### Perfil Pessoa Jurídica
**Descrição:**  
Profissionais autônomos e donos de pequenos negócios que precisam gerenciar receitas e despesas de forma mais eficiente.  

**Necessidades:**  
Controle de fluxo de caixa, separação entre finanças pessoais e empresariais, planejamento para investimentos.  

### Perfil Organizações Sem Fins Lucrativos
**Descrição:**  
ONGs, associações e projetos sociais que precisam gerenciar recursos financeiros de forma transparente.  

**Necessidades:**  
Controle sobre doações recebidas, monitoramento de gastos, prestação de contas para apoiadores e financiadores.  

## Histórias de Usuários

| EU COMO... `QUEM`            | QUERO/DESEJO ... `O QUE`                                   | PARA ... `PORQUE`                                      |
|------------------------------|----------------------------------------------------------|-------------------------------------------------------|
| Pessoa Física                | Cadastrar minhas receitas e despesas                     | Ter controle eficiente do meu orçamento e evitar gastos desnecessários. |
| Pessoa Física                | Planejar orçamentos                                      | Controlar gastos, evitar dívidas e alcançar estabilidade financeira. |
| Pessoa Física                | Consultar minha saúde financeira                         | Definir novas metas subsequentes aos resultados financeiros. |
| Pessoa Física                | Visualizar um resumo financeiro na página inicial        | Ter uma visão rápida e clara da minha situação financeira atual. |
| Pessoa Física                | Converter valores entre diferentes moedas                | Ter uma referência atualizada para minhas transações internacionais. |
| Pessoa Física                | Filtrar e ordenar minhas transações                      | Encontrar rapidamente informações específicas e organizar meus dados financeiros. |
| Pessoa Física                | Personalizar meu perfil                                  | Manter minhas informações atualizadas e seguras. |
| Pessoa Física                | Recuperar minha senha quando esquecida                   | Manter o acesso à minha conta mesmo em caso de esquecimento. |
| Pessoa Física                | Alternar entre tema claro e escuro                       | Usar o aplicativo de forma confortável em diferentes ambientes. |
| Pessoa Física                | Acessar o sistema em diferentes idiomas                  | Utilizar a plataforma no idioma que me sinto mais confortável. |
| Pessoa Física                | Entrar em contato com o suporte                          | Resolver dúvidas e problemas técnicos quando necessário. |
| Pessoa Jurídica              | Ter maior autonomia no fluxo de caixa                    | Definir planos para o crescimento do meu negócio.     |
| Pessoa Jurídica              | Separar finanças pessoais e empresariais                 | Analisar minha saúde financeira pessoal e a saúde financeira da minha empresa. |
| Pessoa Jurídica              | Cadastrar investimentos                                  | Definir novos planos de investimento e resultados previsíveis. |
| Pessoa Jurídica              | Filtrar e ordenar investimentos                          | Analisar melhor meus investimentos e tomar decisões mais assertivas. |
| Organização sem fins lucrativos | Cadastrar doações da organização                      | Controlar o montante doado e redirecionar essas doações. |
| Organização sem fins lucrativos | Monitorar meus gastos                                 | Analisar gastos excessivos e tomar decisões pautadas nos dados registrados. |
| Organização sem fins lucrativos | Prestar contas a apoiadores e financiadores           | Proteger a integridade e confiabilidade da organização. |
| Organização sem fins lucrativos | Converter valores de doações internacionais           | Manter um controle preciso das doações recebidas em diferentes moedas. |

## Requisitos do Projeto

### Requisitos Funcionais

| ID    | Descrição                                                                 | Prioridade |
|-------|---------------------------------------------------------------------------|------------|
| RF-01 | O usuário deve poder cadastrar, editar e excluir receitas e despesas manualmente, podendo categorizá-las (ex.: Educação, Jogos, Saúde, Moradia etc.). | Alta       |
| RF-02 | O sistema deve permitir a adição de recorrência em transações (mensal, semanal, anual) e estimar valores totais e prazos de término. | Média      |
| RF-03 | O usuário deve conseguir marcar transações como "pagas" ou "recebidas" e acompanhar contas a pagar e a receber com lembretes e status. | Baixa      |
| RF-04 | O sistema deve gerar relatórios gráficos sobre o fluxo de receitas, despesas, ativos e passivos financeiros. | Alta       |
| RF-05 | O sistema deve ter status e lembretes de contas a pagar e a receber.      | Baixa      |
| RF-06 | O usuário deve poder definir metas financeiras e acompanhar seu progresso. | Alta       |
| RF-07 | O usuário deve poder criar, acessar, editar e excluir seu perfil, identificando-se como pessoa física ou empresa. | Alta       |
| RF-08 | O usuário deve poder consultar suas finanças pessoais e empresariais em um único lugar. | Média      |
| RF-09 | O sistema deve permitir a criação e o gerenciamento de investimentos.     | Alta       |
| RF-10 | O sistema deve oferecer a opção de ocultar e exibir os valores financeiros na interface por meio de um botão com ícone de olho, garantindo maior privacidade ao usuário. | Alta       |
| RF-11 | O sistema deve incluir uma página inicial (home) com exibição de saldos totais e resumo financeiro. | Alta       |
| RF-12 | O sistema deve implementar um conversor de moedas integrado. | Média      |
| RF-13 | O sistema deve permitir filtros de busca e ordenação em investimentos, receitas e despesas. | Alta       |
| RF-14 | O sistema deve incluir uma página de perfil com informações detalhadas do usuário. | Alta       |
| RF-15 | O sistema deve implementar autenticação com login, cadastro e recuperação de senha. | Alta       |
| RF-16 | O sistema deve incluir uma página de contato para suporte. | Média      |
| RF-17 | O sistema deve implementar uma página 404 personalizada para rotas não encontradas. | Baixa      |
| RF-18 | O sistema deve incluir uma página "Sobre" com informações do projeto. | Baixa      |

### Requisitos Não Funcionais

| ID     | Descrição                                                                 | Prioridade |
|--------|---------------------------------------------------------------------------|------------|
| RNF-01 | A interface deve ser intuitiva e de fácil navegação, permitindo que qualquer usuário realize suas tarefas sem necessidade de treinamento prévio. | Alta       |
| RNF-02 | O sistema deve ser responsivo, garantindo uma experiência otimizada tanto em dispositivos móveis quanto em desktops. | Alta       |
| RNF-03 | O sistema deve seguir as diretrizes de acessibilidade (WCAG) e (A11y), assegurando a inclusão de usuários com necessidades especiais. | Alta       |
| RNF-04 | Dados sensíveis devem ser protegidos por criptografia robusta, garantindo a segurança das informações do usuário. | Média      |
| RNF-05 | O sistema deve estar em conformidade com a LGPD (Lei Geral de Proteção de Dados) e a GDPR (Regulamento Geral de Proteção de Dados), garantindo a privacidade e proteção dos dados dos usuários. | Média      |
| RNF-06 | O software deve ser compatível com as versões mais recentes dos principais navegadores web, assegurando um funcionamento adequado e sem falhas. | Alta       |
| RNF-07 | O sistema deve adotar os padrões de Progressive Web App (PWA), permitindo uma experiência mais fluida, offline e com melhor desempenho. | Alta       |
| RNF-08 | O sistema deve implementar suporte a múltiplos idiomas (i18n) com interface traduzível. | Alta       |
| RNF-09 | O sistema deve oferecer temas claro (light mode) e escuro (dark mode) com persistência da preferência do usuário. | Alta       |
| RNF-10 | O sistema deve implementar tratamento de erros adequado e feedback visual para ações do usuário. | Alta       |

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

| ID | Restrição                                             |
|----|-------------------------------------------------------|
| 01 | O projeto deverá ser entregue até o final do semestre |
| 02 | Não pode ser desenvolvido um módulo de backend        |
