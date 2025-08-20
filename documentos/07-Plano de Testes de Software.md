# Plano de Testes de Software

<span style="color:red">Pré-requisitos: <a href="https://github.com/ICEI-PUC-Minas-PMV-ADS/ads-e1-exemplo-vida-de-estudante/tree/main/documentos/02-Especificação%20do%20Projeto.md"> Especificação do Projeto</a></span>, <a href="https://github.com/ICEI-PUC-Minas-PMV-ADS/ads-e1-exemplo-vida-de-estudante/tree/main/documentos/04-Projeto%20de%20Interface.md"> Projeto de Interface</a>

Os requisitos para realização dos testes de software são:

<ul>
<li>Site publicado na internet com Github Pages - <a href="https://savemoney.app.br">Save Money</a>.</li>
<li>Navegador da internet: Chrome, Firefox ou Edge.</li>
</ul>

## CT-01: Verificar a página de login
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-01: Verificar a página de login</td>
<td>
<ul>
<li>RF-08: O usuário deve poder fazer login e logout no sistema.</li>
</ul>
</td>
<td>Verificar se a página de login está funcionando corretamente</td>
<td>
<ol>
<li>Acessar o navegador.</li>
<li>Informar o endereço do site.</li>
<li>Verificar a exibição da logo e subtítulo.</li>
<li>Verificar a exibição do componente de darkmode.</li>
<li>Verificar a exibição do título "Login".</li>
<li>Verificar a exibição dos campos de e-mail e senha.</li>
<li>Verificar a exibição do botão "Entrar".</li>
<li>Verificar a exibição do botão "registrar".</li>
<li>Verificar a exibição do link de recuperação de senha.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve exibir a logo com texto "Save Money".</li>
<li>O sistema deve exibir o subtítulo "PUC Minas Tecnologia".</li>
<li>O sistema deve exibir o componente de darkmode.</li>
<li>O sistema deve exibir o título "Login".</li>
<li>O sistema deve exibir os campos de e-mail e senha.</li>
<li>O sistema deve exibir o botão "Entrar".</li>
<li>O sistema deve exibir o botão "registrar".</li>
<li>O sistema deve exibir o link de recuperação de senha.</li>
</ul>
</td>
<td>Lucas Ferreira de Lima</td>
</tr>
</table>

## CT-02: Verificar o processo de login
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-02: Verificar o processo de login</td>
<td>
<ul>
<li>RF-08: O usuário deve poder fazer login e logout no sistema.</li>
</ul>
</td>
<td>Verificar se o processo de login está funcionando corretamente</td>
<td>
<ol>
<li>Acessar a página de login.</li>
<li>Clicar em "Entrar" sem preencher os campos.</li>
<li>Preencher e-mail inválido e senha errada.</li>
<li>Clicar em "Entrar".</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve exibir mensagem de erro ao tentar login com campos vazios.</li>
<li>O sistema deve exibir mensagem de erro ao tentar login com credenciais inválidas.</li>
</ul>
</td>
<td>Lucas Ferreira de Lima</td>
</tr>
</table>

## CT-03: Verificar a página de cadastro
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-03: Verificar a página de cadastro</td>
<td>
<ul>
<li>RF-07: O usuário deve poder criar, acessar, editar e excluir seu perfil.</li>
</ul>
</td>
<td>Verificar se a página de cadastro está funcionando corretamente</td>
<td>
<ol>
<li>Acessar a página de cadastro.</li>
<li>Verificar a exibição do título.</li>
<li>Verificar a exibição dos campos obrigatórios.</li>
<li>Verificar a exibição do botão de cadastro.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve exibir o título "Cadastro".</li>
<li>O sistema deve exibir os campos: Nome, E-mail, Documento, Senha, Confirmar senha.</li>
<li>O sistema deve exibir o checkbox de termos.</li>
<li>O sistema deve exibir o botão "Cadastrar".</li>
</ul>
</td>
<td>Matheus Carlos de S. B. de Oliveira</td>
</tr>
</table>

## CT-04: Verificar o processo de cadastro
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-04: Verificar o processo de cadastro</td>
<td>
<ul>
<li>RF-07: O usuário deve poder criar, acessar, editar e excluir seu perfil.</li>
</ul>
</td>
<td>Verificar se o processo de cadastro está funcionando corretamente</td>
<td>
<ol>
<li>Acessar a página de cadastro.</li>
<li>Clicar em "Cadastrar" sem preencher os campos.</li>
<li>Preencher o formulário com senhas diferentes.</li>
<li>Preencher o formulário corretamente e aceitar os termos.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve exibir mensagem de erro ao tentar cadastrar com campos vazios.</li>
<li>O sistema deve exibir mensagem de erro ao tentar cadastrar com senhas diferentes.</li>
<li>O sistema deve cadastrar o usuário com sucesso e permitir login.</li>
</ul>
</td>
<td>Matheus Carlos de S. B. de Oliveira</td>
</tr>
</table>

## CT-05: Verificar a página de recuperação de senha
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-05: Verificar a página de recuperação de senha</td>
<td>
<ul>
<li>RF-09: O usuário deve poder recuperar sua senha.</li>
</ul>
</td>
<td>Verificar se a página de recuperação de senha está funcionando corretamente</td>
<td>
<ol>
<li>Acessar a página de recuperação de senha.</li>
<li>Verificar a exibição do título.</li>
<li>Verificar a exibição do campo de e-mail.</li>
<li>Verificar a exibição dos botões.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve exibir o título "Recuperar senha".</li>
<li>O sistema deve exibir o campo de e-mail.</li>
<li>O sistema deve exibir o botão "Enviar instruções".</li>
<li>O sistema deve exibir o botão "Voltar para login".</li>
</ul>
</td>
<td>Lucas Ferreira de Lima</td>
</tr>
</table>

## CT-06: Verificar a página de investimentos
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-06: Verificar a página de investimentos</td>
<td>
<ul>
<li>RF-10: O usuário deve poder gerenciar seus investimentos.</li>
</ul>
</td>
<td>Verificar se a página de investimentos está funcionando corretamente</td>
<td>
<ol>
<li>Fazer login no sistema.</li>
<li>Acessar a página de investimentos.</li>
<li>Verificar a exibição do título e lista vazia.</li>
<li>Clicar no botão de adicionar investimento.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve exibir o título "Investimentos".</li>
<li>O sistema deve exibir mensagem de investimentos vazios.</li>
<li>O sistema deve exibir o modal de adicionar investimento.</li>
</ul>
</td>
<td>Lucas Ferreira de Lima</td>
</tr>
</table>

## CT-07: Verificar a página de perfil
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-07: Verificar a página de perfil</td>
<td>
<ul>
<li>RF-07: O usuário deve poder criar, acessar, editar e excluir seu perfil.</li>
</ul>
</td>
<td>Verificar se a página de perfil está funcionando corretamente</td>
<td>
<ol>
<li>Fazer login no sistema.</li>
<li>Acessar a página de perfil pelo menu.</li>
<li>Clicar no botão de excluir conta.</li>
<li>Confirmar a exclusão.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve permitir acessar a página de perfil pelo menu.</li>
<li>O sistema deve exibir o botão "Excluir Conta".</li>
<li>O sistema deve exibir o modal de confirmação.</li>
<li>O sistema deve excluir o usuário com sucesso.</li>
</ul>
</td>
<td>Matheus Carlos de S. B. de Oliveira</td>
</tr>
</table>

## CT-08: Verificar a página não encontrada
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-08: Verificar a página não encontrada</td>
<td>
<ul>
<li>RF-11: O sistema deve tratar adequadamente páginas não encontradas.</li>
</ul>
</td>
<td>Verificar se o tratamento de páginas não encontradas está funcionando corretamente</td>
<td>
<ol>
<li>Acessar uma URL inexistente sem estar logado.</li>
<li>Verificar a exibição da página de erro.</li>
<li>Clicar no botão de login.</li>
<li>Acessar uma URL inexistente estando logado.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve exibir a página não encontrada para usuário não autenticado.</li>
<li>O sistema deve redirecionar para a página de login ao clicar no botão.</li>
<li>O sistema deve exibir a página não encontrada para usuário autenticado.</li>
</ul>
</td>
<td>Lucas Ferreira de Lima</td>
</tr>
</table>

## CT-09: Verificar a página de alterar usuário
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-09: Verificar a página de alterar usuário</td>
<td>
<ul>
<li>RF-07: O usuário deve poder criar, acessar, editar e excluir seu perfil, identificando-se como pessoa física ou empresa.</li>
</ul>
</td>
<td>Vai verificar a alteração dos dados do usuário</td>
<td>
<ol>
<li>Acessar página de alterar usuário</li>
<li>Alterar nome do usuário</li>
<li>Alterar senha do usuário</li>
<li>Alterar confirmar-senha do usuário</li>
<li>Clicar no botão de salvar alterações.</li>
<li>As alterações foram salvos.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve exibir a página alterar usuário.</li>
<li>O sistema deve permitir alterar nome, senha e salvar alterações.</li>
<li>O sistema deve exibir que as alterações foram salvas.</li>
</ul>
</td>
<td>Matheus Carlos de S. B. de Oliveira</td>
</tr>
</table>

## CT-10: Verificar funcionalidade de privacidade
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-10: Verificar a funcionalidade de privacidade</td>
<td>
<ul>
<li>RF-10: O sistema deve oferecer a opção de ocultar e exibir os valores financeiros na interface por meio de um botão com icone de olho, garantindo maior privacidade ao usuário.</li>
</ul>
</td>
<td>Verificar se a funcionalidade de privacidade está funcionando corretamente.</td>
<td>
<ol>
<li>Acessar pagina que contém valores financeiros do usuário.</li>
<li>Clicar no icone de "olho aberto".</li>
<li>Verificar se o icone de "olho aberto" foi alterado para o icone de "olho fechado".</li>
<li>Verificar se os valores financeiros foram ocultados.</li>
<li>Clicar no icone de "olho fechado" e verificar se o icone foi alterado para "olho aberto" e os valores financeiros foram exibidos novamente.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve ocultar todos os valores financeiros ao clicar no icone de "olho aberto".</li>
<li>O sistema deve alterar o icone de "olho aberto" para o icone de "olho fechado".</li>
<li>Ao clicar no icone de "olho fechado" o sistema deve exibir novamente os valores financeiros.</li>
<li>O sistema deve alterar o icone de "olho fechado" para o icone de "olho aberto".</li>
</ul>
</td>
<td>Thais Lellis Moreira</td>
</tr>
</table>

## CT-11: Verificar o status e lembretes de contas
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-11: Verificar o status e lembretes de contas</td>
<td>
<ul>
<li>RF-05: O sistema deve ter status e lembretes de contas a pagar e a receber.</li>
</ul>
</td>
<td>Verificar o sistema de status e lembretes está funcionando corretamente.</td>
<td>
<ol>
<li>Cadastrar despesas.</li>
<li>Acessar a opção "à vencer" na barra lateral.</li>
<li>Verificar se foram registradas em cards as despesas cadastradas com nome, data de vencimento, valor a pagar, categoria, recorrência, frequência e lembrete de prazo de vencimento.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve mostrar nome, data de vencimento, valor a pagar, categoria, recorrência e frequência da despesa registrada.</li>
<li>O sistema deve exibir lembretes de contas proximas do prazo de vencimento.</li>
</ul>
</td>
<td>Thais Lellis Moreira</td>
</tr>
</table>

## CT-12: Verificar geração de relatório para receitas e despesas
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-12: Verificar geração de relatório para receitas e despesas</td>
<td>
<ul>
<li>RF-04: O sistema deve gerar relatórios gráficos sobre o fluxo de receitas, despesas, ativos e passivos financeiros.</li>
</ul>
</td>
<td>Verificar a geração de relatório funcionando corretamente.</td>
<td>
<ol>
<li>Cadastrar receitas e despesas.</li>
<li>Acessar a opção "relatórios" na barra lateral.</li>
<li>Verificar se foram registradas em cards as receitas e despesas cadastradas com nome, data de vencimento, valor a pagar, categoria, recorrência, frequência e lembrete de prazo de vencimento.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve mostrar total de despesas, total de receitas e saldo. </li>
<li>O sistema deve exibir gráfico doughnut para representar a porcentagem de despesas por categoria cadastrada.</li>
</ul>
</td>
<td>Vitor Reck Tavares</td>
</tr>
</table>

## CT-13: Verificar geração de metas financeiras
<table>
<tr>
<th>Caso de teste</th>
<th>Requisitos associados</th>
<th>Objetivo do teste</th>
<th>Passos</th>
<th>Critérios de êxito</th>
<th>Responsável</th>
</tr>
<tr>
<td>CT-13: Verificar geração de relatório para receitas e despesas</td>
<td>
<ul>
<li>RF-06: O sistema deve gerar metas financeiras cadastradas pelo usuário.</li>
</ul>
</td>
<td>Cadastramento de metas financeiras.</td>
<td>
<ol>
<li>Cadastrar meta financeira.</li>
<li>Editar meta financeira.</li>
<li>Excluir meta financeira.</li>
<li>Incluir valor na meta financeira.</li>
<li>Não cadastrar uma meta em caso de não informação dos dados referentes a meta.</li>
</ol>
</td>
<td>
<ul>
<li>O sistema deve mostrar metas financeiras cadastradas.</li>
<li>O sistema deve mostrar o progresso das metas financeiras.</li>
</ul>
</td>
<td>Breno Eller Andrade Machado</td>
</tr>
</table>
