# Registro de Testes de Software

Relatório com as evidências dos testes de software realizados na aplicação pela equipe, baseado no plano de testes pré-definido.

## CT-01: Verificar a página de login

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-01 - Verificar a página de login</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ A página de login foi testada com sucesso:<br>
- Sistema exibiu o título "Login"<br>
- Sistema exibiu os campos de e-mail e senha<br>
- Sistema exibiu os botões "Entrar" e "Cadastrar"<br>
- Sistema exibiu o link "Esqueceu a senha?"
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Lucas Ferreira de Lima</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Vídeo do teste:</h2>
<video src="./testes/videos/pagina_login.spec.cy.js.mp4" controls width="auto"></video><br>
<a href="./testes/videos/pagina_login.spec.cy.js.mp4" download>Download do vídeo</a><br><br>

<hr>

<h2>Screenshots - Desktop (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bdesktop%2C%20light-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Desktop Light Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Desktop Light Login Inválido - pagina_login.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Desktop (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bdesktop%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Desktop Dark Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Desktop Dark Login Inválido - pagina_login.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Btablet%2C%20light-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Tablet Light Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Btablet%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Tablet Light Login Inválido - pagina_login.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Btablet%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Tablet Dark Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Tablet Dark Login Inválido - pagina_login.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bmobile%2C%20light-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Mobile Light Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Mobile Light Login Inválido - pagina_login.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bmobile%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Mobile Dark Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Mobile Dark Login Inválido - pagina_login.spec.cy.js" 
width="auto"
>
</td>
</tr>
</table>

## CT-02: Verificar o processo de login

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-02 - Verificar o processo de login</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>✅ O processo de login foi testado com sucesso:<br>- Sistema não permitiu login com campos vazios<br>- Sistema exibiu erro ao tentar login com credenciais inválidas<br>- Sistema permitiu login com sucesso</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Lucas Ferreira de Lima</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Vídeo do teste:</h2>
<video src="./testes/videos/pagina_login.spec.cy.js.mp4" controls width="auto"></video><br>
<a href="./testes/videos/pagina_login.spec.cy.js.mp4" download>Download do vídeo</a><br><br>

<hr>

<h2>Screenshots - Desktop (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bdesktop%2C%20light-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Desktop Light Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Desktop Light Login Inválido - pagina_login.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Desktop (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bdesktop%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Desktop Dark Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Desktop Dark Login Inválido - pagina_login.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Btablet%2C%20light-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Tablet Light Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Btablet%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Tablet Light Login Inválido - pagina_login.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Btablet%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Tablet Dark Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Tablet Dark Login Inválido - pagina_login.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bmobile%2C%20light-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Mobile Light Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Mobile Light Login Inválido - pagina_login.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bmobile%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20login%20com%20campos%20vazios.png" 
alt="Login - Mobile Dark Campos Vazios - pagina_login.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_login.spec.cy.js/Página%20de%20Login%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20login%20inválido.png" 
alt="Login - Mobile Dark Login Inválido - pagina_login.spec.cy.js" 
width="auto"
>
</td>
</tr>
</table>

## CT-03: Verificar a página de cadastro

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-03 - Verificar a página de cadastro</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ A página de cadastro foi testada com sucesso:<br>
- Sistema exibiu o título "Cadastro"<br>
- Sistema exibiu os campos de nome, e-mail, senha e confirmar senha<br>
- Sistema exibiu os botões "Cadastrar" e "Voltar para login"
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Matheus Carlos de S. B. de Oliveira</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Vídeo do teste:</h2>
<video src="./testes/videos/pagina_cadastro.spec.cy.js.mp4" controls width="auto"></video><br>
<a href="./testes/videos/pagina_cadastro.spec.cy.js.mp4" download>Download do vídeo</a><br><br>

<hr>

<h2>Screenshots - Desktop (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20light-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Desktop Light Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Desktop Light Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Desktop Light Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Desktop (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Desktop Dark Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Desktop Dark Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Desktop Dark Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20light-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Tablet Light Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Tablet Light Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20light-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Tablet Light Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Tablet Dark Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Tablet Dark Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Tablet Dark Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20light-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Mobile Light Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Mobile Light Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Mobile Light Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Mobile Dark Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Mobile Dark Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Mobile Dark Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
>
</td>
</tr>
</table>

## CT-04: Verificar o processo de cadastro

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-04 - Verificar o processo de cadastro</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ O processo de cadastro foi testado com sucesso:<br>
- Sistema não permitiu cadastro com campos vazios<br>
- Sistema exibiu erro ao tentar cadastrar com senhas diferentes<br>
- Sistema permitiu cadastro com sucesso
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Matheus Carlos de S. B. de Oliveira</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Vídeo do teste:</h2>
<video src="./testes/videos/pagina_cadastro.spec.cy.js.mp4" controls width="auto"></video><br>
<a href="./testes/videos/pagina_cadastro.spec.cy.js.mp4" download>Download do vídeo</a><br><br>

<hr>

<h2>Screenshots - Desktop (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20light-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Desktop Light Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Desktop Light Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Desktop Light Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Desktop (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Desktop Dark Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Desktop Dark Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Desktop Dark Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20light-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Tablet Light Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Tablet Light Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20light-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Tablet Light Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Tablet Dark Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Tablet Dark Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Tablet Dark Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20light-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Mobile Light Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Mobile Light Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Mobile Light Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20dark-mode%5D%20--%20não%20deve%20permitir%20cadastro%20com%20campos%20vazios.png" 
alt="Cadastro - Mobile Dark Campos Vazios - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20exibir%20erro%20ao%20tentar%20cadastrar%20com%20senhas%20diferentes.png" 
alt="Cadastro - Mobile Dark Senhas Diferentes - pagina_cadastro.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_cadastro.spec.cy.js/Página%20de%20Cadastro%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20cadastrar%20usuário%20com%20sucesso.png" 
alt="Cadastro - Mobile Dark Sucesso - pagina_cadastro.spec.cy.js" 
width="auto"
>
</td>
</tr>
</table>

## CT-05: Verificar a página de recuperação de senha

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-05 - Verificar a página de recuperação de senha</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ A página de recuperação de senha foi testada com sucesso:<br>
- Sistema exibiu o título "Recuperar senha"<br>
- Sistema exibiu o campo de e-mail<br>
- Sistema exibiu os botões "Enviar" e "Voltar para login"
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Lucas Ferreira de Lima</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Vídeo do teste:</h2>
<video src="./testes/videos/pagina_recuperar-senha.spec.cy.js.mp4" controls width="auto"></video><br>
<a href="./testes/videos/pagina_recuperar-senha.spec.cy.js.mp4" download>Download do vídeo</a><br><br>

<hr>

<h2>Screenshots - Desktop (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_recuperar-senha.spec.cy.js/Página%20de%20Recuperar%20senha%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20mostrar%20a%20página%20de%20recuperar%20senha.png" 
alt="Recuperar Senha - Desktop Light - pagina_recuperar-senha.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Desktop (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_recuperar-senha.spec.cy.js/Página%20de%20Recuperar%20senha%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20mostrar%20a%20página%20de%20recuperar%20senha.png" 
alt="Recuperar Senha - Desktop Dark - pagina_recuperar-senha.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_recuperar-senha.spec.cy.js/Página%20de%20Recuperar%20senha%20%5Btablet%2C%20light-mode%5D%20--%20deve%20mostrar%20a%20página%20de%20recuperar%20senha.png" 
alt="Recuperar Senha - Tablet Light - pagina_recuperar-senha.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_recuperar-senha.spec.cy.js/Página%20de%20Recuperar%20senha%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20mostrar%20a%20página%20de%20recuperar%20senha.png" 
alt="Recuperar Senha - Tablet Dark - pagina_recuperar-senha.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_recuperar-senha.spec.cy.js/Página%20de%20Recuperar%20senha%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20mostrar%20a%20página%20de%20recuperar%20senha.png" 
alt="Recuperar Senha - Mobile Light - pagina_recuperar-senha.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_recuperar-senha.spec.cy.js/Página%20de%20Recuperar%20senha%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20mostrar%20a%20página%20de%20recuperar%20senha.png" 
alt="Recuperar Senha - Mobile Dark - pagina_recuperar-senha.spec.cy.js" 
width="auto"
>
</td>
</tr>
</table>

## CT-06: Verificar a página de investimentos

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-06 - Verificar a página de investimentos</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ A página de investimentos foi testada com sucesso:<br>
- Sistema exibiu o título "Investimentos"<br>
- Sistema exibiu a mensagem de investimentos vazios<br>
- Sistema exibiu o modal de adicionar investimento<br>
- Sistema permitiu adicionar um investimento com sucesso
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Lucas Ferreira de Lima</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Vídeo do teste:</h2>
<video src="./testes/videos/pagina_investimentos.spec.cy.js.mp4" controls width="auto"></video><br>
<a href="./testes/videos/pagina_investimentos.spec.cy.js.mp4" download>Download do vídeo</a><br><br>

<hr>

<h2>Screenshots - Desktop (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20exibir%20o%20titulo%20Investimentos%20e%20investimentos%20vazios.png" 
alt="Investimentos - Desktop Light Lista Vazia - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento.png" 
alt="Investimentos - Desktop Light Modal Adicionar - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento%20preenchido.png" 
alt="Investimentos - Desktop Light Modal Preenchido - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20adicionar%20um%20investimento%20com%20sucesso.png" 
alt="Investimentos - Desktop Light Sucesso - pagina_investimentos.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Desktop (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20exibir%20o%20titulo%20Investimentos%20e%20investimentos%20vazios.png" 
alt="Investimentos - Desktop Dark Lista Vazia - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento.png" 
alt="Investimentos - Desktop Dark Modal Adicionar - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento%20preenchido.png" 
alt="Investimentos - Desktop Dark Modal Preenchido - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20adicionar%20um%20investimento%20com%20sucesso.png" 
alt="Investimentos - Desktop Dark Sucesso - pagina_investimentos.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Btablet%2C%20light-mode%5D%20--%20deve%20exibir%20o%20titulo%20Investimentos%20e%20investimentos%20vazios.png" 
alt="Investimentos - Tablet Light Lista Vazia - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Btablet%2C%20light-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento.png" 
alt="Investimentos - Tablet Light Modal Adicionar - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Btablet%2C%20light-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento%20preenchido.png" 
alt="Investimentos - Tablet Light Modal Preenchido - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Btablet%2C%20light-mode%5D%20--%20deve%20adicionar%20um%20investimento%20com%20sucesso.png" 
alt="Investimentos - Tablet Light Sucesso - pagina_investimentos.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20exibir%20o%20titulo%20Investimentos%20e%20investimentos%20vazios.png" 
alt="Investimentos - Tablet Dark Lista Vazia - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento.png" 
alt="Investimentos - Tablet Dark Modal Adicionar - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento%20preenchido.png" 
alt="Investimentos - Tablet Dark Modal Preenchido - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20adicionar%20um%20investimento%20com%20sucesso.png" 
alt="Investimentos - Tablet Dark Sucesso - pagina_investimentos.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20exibir%20o%20titulo%20Investimentos%20e%20investimentos%20vazios.png" 
alt="Investimentos - Mobile Light Lista Vazia - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento.png" 
alt="Investimentos - Mobile Light Modal Adicionar - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento%20preenchido.png" 
alt="Investimentos - Mobile Light Modal Preenchido - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20adicionar%20um%20investimento%20com%20sucesso.png" 
alt="Investimentos - Mobile Light Sucesso - pagina_investimentos.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20exibir%20o%20titulo%20Investimentos%20e%20investimentos%20vazios.png" 
alt="Investimentos - Mobile Dark Lista Vazia - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento.png" 
alt="Investimentos - Mobile Dark Modal Adicionar - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20exibir%20o%20modal%20de%20adicionar%20investimento%20preenchido.png" 
alt="Investimentos - Mobile Dark Modal Preenchido - pagina_investimentos.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_investimentos.spec.cy.js/Página%20de%20Investimentos%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20adicionar%20um%20investimento%20com%20sucesso.png" 
alt="Investimentos - Mobile Dark Sucesso - pagina_investimentos.spec.cy.js" 
width="auto"
>
</td>
</tr>
</table>

## CT-07: Verificar a página de perfil

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-07 - Verificar a página de perfil</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ A página de perfil foi testada com sucesso:<br>
- Sistema permitiu acessar a página de perfil pelo menu<br>
- Sistema exibiu o modal de deslogar usuário<br>
- Sistema exibiu o modal de deletar usuário<br>
- Sistema permitiu deletar o usuário com sucesso
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Matheus Carlos de S. B. de Oliveira</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Vídeo do teste:</h2>
<video src="./testes/videos/pagina_perfil.spec.cy.js.mp4" controls width="auto"></video><br>
<a href="./testes/videos/pagina_perfil.spec.cy.js.mp4" download>Download do vídeo</a><br><br>

<hr>

<h2>Screenshots - Desktop (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20conseguir%20acessar%20página%20de%20perfil%20pelo%20menu.png" 
alt="Perfil - Desktop Light Menu - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bdesktop%2C%20light-mode%5D%20--%20modal%20deslogar%20usuário.png" 
alt="Perfil - Desktop Light Modal Deslogar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bdesktop%2C%20light-mode%5D%20--%20modal%20deletar%20usuário.png" 
alt="Perfil - Desktop Light Modal Deletar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bdesktop%2C%20light-mode%5D%20--%20usuário%20deletado%20com%20sucessso.png" 
alt="Perfil - Desktop Light Sucesso - pagina_perfil.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Desktop (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20conseguir%20acessar%20página%20de%20perfil%20pelo%20menu.png" 
alt="Perfil - Desktop Dark Menu - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bdesktop%2C%20dark-mode%5D%20--%20modal%20deslogar%20usuário.png" 
alt="Perfil - Desktop Dark Modal Deslogar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bdesktop%2C%20dark-mode%5D%20--%20modal%20deletar%20usuário.png" 
alt="Perfil - Desktop Dark Modal Deletar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bdesktop%2C%20dark-mode%5D%20--%20usuário%20deletado%20com%20sucessso.png" 
alt="Perfil - Desktop Dark Sucesso - pagina_perfil.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Btablet%2C%20light-mode%5D%20--%20deve%20conseguir%20acessar%20página%20de%20perfil%20pelo%20menu.png" 
alt="Perfil - Tablet Light Menu - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Btablet%2C%20light-mode%5D%20--%20modal%20deslogar%20usuário.png" 
alt="Perfil - Tablet Light Modal Deslogar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Btablet%2C%20light-mode%5D%20--%20modal%20deletar%20usuário.png" 
alt="Perfil - Tablet Light Modal Deletar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Btablet%2C%20light-mode%5D%20--%20usuário%20deletado%20com%20sucessso.png" 
alt="Perfil - Tablet Light Sucesso - pagina_perfil.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20conseguir%20acessar%20página%20de%20perfil%20pelo%20menu.png" 
alt="Perfil - Tablet Dark Menu - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Btablet%2C%20dark-mode%5D%20--%20modal%20deslogar%20usuário.png" 
alt="Perfil - Tablet Dark Modal Deslogar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Btablet%2C%20dark-mode%5D%20--%20modal%20deletar%20usuário.png" 
alt="Perfil - Tablet Dark Modal Deletar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Btablet%2C%20dark-mode%5D%20--%20usuário%20deletado%20com%20sucessso.png" 
alt="Perfil - Tablet Dark Sucesso - pagina_perfil.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20conseguir%20acessar%20página%20de%20perfil%20pelo%20menu.png" 
alt="Perfil - Mobile Light Menu - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bmobile%2C%20light-mode%5D%20--%20modal%20deslogar%20usuário.png" 
alt="Perfil - Mobile Light Modal Deslogar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bmobile%2C%20light-mode%5D%20--%20modal%20deletar%20usuário.png" 
alt="Perfil - Mobile Light Modal Deletar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bmobile%2C%20light-mode%5D%20--%20usuário%20deletado%20com%20sucessso.png" 
alt="Perfil - Mobile Light Sucesso - pagina_perfil.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20conseguir%20acessar%20página%20de%20perfil%20pelo%20menu.png" 
alt="Perfil - Mobile Dark Menu - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bmobile%2C%20dark-mode%5D%20--%20modal%20deslogar%20usuário.png" 
alt="Perfil - Mobile Dark Modal Deslogar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bmobile%2C%20dark-mode%5D%20--%20modal%20deletar%20usuário.png" 
alt="Perfil - Mobile Dark Modal Deletar - pagina_perfil.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_perfil.spec.cy.js/Página%20de%20Perfil%20%5Bmobile%2C%20dark-mode%5D%20--%20usuário%20deletado%20com%20sucessso.png" 
alt="Perfil - Mobile Dark Sucesso - pagina_perfil.spec.cy.js" 
width="auto"
>
</td>
</tr>
</table>

## CT-08: Verificar a página não encontrada

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-08 - Verificar a página não encontrada</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ A página não encontrada foi testada com sucesso:<br>
- Sistema exibiu a mensagem "Página não encontrada" para usuário não autenticado<br>
- Sistema exibiu a mensagem "Página não encontrada" para usuário autenticado
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Lucas Ferreira de Lima</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Vídeo do teste:</h2>
<video src="./testes/videos/pagina_nao-encontrada.spec.cy.js.mp4" controls width="auto"></video><br>
<a href="./testes/videos/pagina_nao-encontrada.spec.cy.js.mp4" download>Download do vídeo</a><br><br>

<hr>

<h2>Screenshots - Desktop (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20não%20autenticado.png" 
alt="Página Não Encontrada - Desktop Light Não Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20autenticado.png" 
alt="Página Não Encontrada - Desktop Light Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Desktop (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20não%20autenticado.png" 
alt="Página Não Encontrada - Desktop Dark Não Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20autenticado.png" 
alt="Página Não Encontrada - Desktop Dark Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Btablet%2C%20light-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20não%20autenticado.png" 
alt="Página Não Encontrada - Tablet Light Não Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Btablet%2C%20light-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20autenticado.png" 
alt="Página Não Encontrada - Tablet Light Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Tablet (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20não%20autenticado.png" 
alt="Página Não Encontrada - Tablet Dark Não Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20autenticado.png" 
alt="Página Não Encontrada - Tablet Dark Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20não%20autenticado.png" 
alt="Página Não Encontrada - Mobile Light Não Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20autenticado.png" 
alt="Página Não Encontrada - Mobile Light Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
><br>

<hr>

<h2>Screenshots - Mobile (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20não%20autenticado.png" 
alt="Página Não Encontrada - Mobile Dark Não Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
><br>
<img 
src="./testes/screenshots/pagina_nao-encontrada.spec.cy.js/Página%20não%20encontrada%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20mostrar%20a%20página%20não%20encontrada%20para%20usuário%20autenticado.png" 
alt="Página Não Encontrada - Mobile Dark Autenticado - pagina_nao-encontrada.spec.cy.js" 
width="auto"
>
</td>
</tr>
</table>

## CT-09: Verificar a página de alterar usuário

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-09 - Verificar a página de alterar usuário</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ A página de alteração de usuário foi testada com sucesso:<br>
- Sistema exibiu o formulário de alteração de usuário<br>
- Sistema permitiu alterar o nome do usuário<br>
- Sistema permitiu alterar a senha e confirmar a senha<br>
- Sistema exibiu mensagem de sucesso ao salvar as alterações
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Matheus Carlos de S. B. de Oliveira</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Vídeo do teste:</h2>
<video src="./testes/videos/pagina_alterar-usuario.cy.js.mp4" controls width="auto"></video><br>
<a href="./testes/videos/pagina_alterar-usuario.cy.js.mp4" download>Download do vídeo</a><br><br>

<hr>

<h2>Screenshots - Desktop (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_alterar-usuario.cy.js/Página%20de%20Alterar%20Usuário%20%5Bdesktop%2C%20light-mode%5D%20--%20deve%20conseguir%20alterar%20usuário.png" 
alt="Alterar Usuário - Desktop Light - pagina_alterar-usuario.cy.js" 
width="auto"
><br>

<h2>Screenshots - Desktop (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_alterar-usuario.cy.js/Página%20de%20Alterar%20Usuário%20%5Bdesktop%2C%20dark-mode%5D%20--%20deve%20conseguir%20alterar%20usuário.png" 
alt="Alterar Usuário - Desktop Dark - pagina_alterar-usuario.cy.js" 
width="auto"
><br>

<h2>Screenshots - Tablet (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_alterar-usuario.cy.js/Página%20de%20Alterar%20Usuário%20%5Btablet%2C%20light-mode%5D%20--%20deve%20conseguir%20alterar%20usuário.png" 
alt="Alterar Usuário - Tablet Light - pagina_alterar-usuario.cy.js" 
width="auto"
><br>

<h2>Screenshots - Tablet (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_alterar-usuario.cy.js/Página%20de%20Alterar%20Usuário%20%5Btablet%2C%20dark-mode%5D%20--%20deve%20conseguir%20alterar%20usuário.png" 
alt="Alterar Usuário - Tablet Dark - pagina_alterar-usuario.cy.js" 
width="auto"
><br>

<h2>Screenshots - Mobile (Light Mode):</h2>
<img 
src="./testes/screenshots/pagina_alterar-usuario.cy.js/Página%20de%20Alterar%20Usuário%20%5Bmobile%2C%20light-mode%5D%20--%20deve%20conseguir%20alterar%20usuário.png" 
alt="Alterar Usuário - Mobile Light - pagina_alterar-usuario.cy.js" 
width="auto"
><br>

<h2>Screenshots - Mobile (Dark Mode):</h2>
<img 
src="./testes/screenshots/pagina_alterar-usuario.cy.js/Página%20de%20Alterar%20Usuário%20%5Bmobile%2C%20dark-mode%5D%20--%20deve%20conseguir%20alterar%20usuário.png" 
alt="Alterar Usuário - Mobile Dark - pagina_alterar-usuario.cy.js" 
width="auto"
><br>
</td>
</tr>
</table>

## CT-10: Verificar a funcionalidade de privacidade

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-10 - Verificar a funcionalidade de privacidade</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ A página de login foi testada com sucesso:<br>
- O sistema mostrou o icone de olho de privacidade de valores<br>
- O sistema permitiu o clique no icone de olho<br>
- O sistema ocultou todos os valores financeiros corretamente<br>
- O Sistema exibiu o icone de olho fechado ao clicar no icone de olho<br>
- O Sistema exibiu o icone de olho aberto ao clicar no icone de olho novamente<br>
- O Sistema exibiu os valores financeiros novamente ao clicar no icone de olho
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Thais Lellis Moreira</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Vídeo do teste:</h2>
<a href="https://drive.google.com/file/d/11zuRRzA5CW5q5VHm1FVELmgv2LpUedOF/view?usp=sharing">Assista ao vídeo</a>
<hr>
<h2>Screenshots - Desktop :</h2>
<img 
src="./img/Olho aberto.png" 
><br>
<img 
src="./img/olho fechado.png" 
><br>
</td>
</tr>
</table>

## CT-11: Verificar status e lembretes de contas

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-11 - Verificar status e lembretes de contas</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ A página de login foi testada com sucesso:<br>
- O sistema exibiu cadr de contas conforme foram cadastradas na funcionalidade de despesas<br>
- O sistema exibiu lembretes de contas proximas ao vencimento<br>
- O Sistema exibiu a data de vencimento e valor de cada conta, bem como categoria, recorrência e frequência
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Thais Lellis Moreira</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Vídeo do teste:</h2>
<a href="https://drive.google.com/file/d/1cm-mCnbIyzCaSnBBbAOeqHaGIlzKm0MB/view?usp=sharing">Assista ao vídeo: Parte 1</a><br>
<a href="https://drive.google.com/file/d/1WMtJdJhGwWD3jlTW0g8ZNgXSKz4SK7sE/view?usp=sharing">Assista ao vídeo: Parte 2</a>
<hr>
<h2>Screenshots - Desktop :</h2>
<img 
src="./img/registrodespesasavencer.png" 
><br>
<img 
src="./img/avencer.png" 
><br>
</td>
</tr>
</table>

## CT-12: Verificar geração de relatório para receitas e despesas

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-12: Verificar geração de relatório para receitas e despesas</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ A página de relatórios foi testada com sucesso:<br>
- O sistema exibiu as receitas e despesas cadastradas para geração de relatórios<br>
- O sistema exibiu o relatório com total de despesas, total de receitas e saldo<br>
- O Sistema exibiu gráfico doughnut para representar a porcentagem de despesas por categoria cadastrada
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Vitor Reck Tavares</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Screenshots - Desktop em light mode:</h2>
<img 
src="./img/relatorioreceitascadastradas.jpg" 
><br>
<img
<img 
src="./img/relatoriodespesascadastradas.jpg" 
><br>
<img
><br>
<img 
src="./img/relatoriotela.jpg" 
><br>
<img
<img 
src="./img/relatoriogeradoteste.jpg" 
><br>
<img
</td>
</tr>
</table>

## CT-13: Verificar sistema de metas financeiras

<table>
<tr>
<td><b>Caso de Teste</b></td>
<td>CT-13: Verificar sistema de metas financeiras</td>
</tr>
<tr>
<td><b>Resultados obtidos</b></td>
<td>
✅ A página de metas financeiras foi testada com sucesso:<br>
- O sistema exibiu metas financeiras<br>
- O sistema exibiu o progresso das metas<br>
- O sistema excluiu metas financeiras<br>
- O sistema editou metas financeiras<br>
- O sistema incluiu valor em metas financeiras<br>
- O sistema barrou a criação de metas sem fornecimento de dados<br>
</td>
</tr>
<tr>
<td><b>Responsável pela execução do caso de Teste</b></td>
<td>Breno Eller Andrade Machado</td>
</tr>
<tr>
<td><b>Evidências</b></td>
<td>
<h2>Screenshots - Desktop em light mode:</h2>
<img 
src="./img/testes-meta-financeira/cadastrarMetaFinanceira.png" 
><br>
<img
<img 
src="./img/testes-meta-financeira/editarMetaFinanceira.png" 
><br>
<img
><br>
<img 
src="./img/testes-meta-financeira/exclusaoMetaFinanceira.png" 
><br>
<img 
src="./img/testes-meta-financeira/incluirValorMetaFinanceira.png" 
><br>
<img
src="./img/testes-meta-financeira/validacaoMetaFinanceira.png" 
><br>
</td>
</tr>
</table>
