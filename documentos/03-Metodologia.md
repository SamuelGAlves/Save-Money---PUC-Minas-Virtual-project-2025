# Metodologia

A metodologia para condução do projeto será <em>Scrum</em>(O Guia do Scrum, 2020), seguindo seus rituais de <em>Daily</em>, <em>Planning</em>, <em>Retrospective</em> e <em>Review</em>. Desenvolvimento das tarefas terão tempo hábil de uma semana no formato de <em>sprint</em>, criando artefatos em seus rituais: <em>Backlog</em> do produto e <em>backlog</em> da <em>sprint</em>

- **Daily**: Reunião diária com objetivo de acompanhamento das tarefas e verificar impedimentos no desenvolvimento
- **Planning**: Reunião ao iniciar <em>sprints</em>, com objetivo de alinhamento da equipe e criação do artefato: <em>Backlog</em> do produto
- **Retrospective**: Reunião ao terminar ciclos de <em>sprints</em>, com objetivo de avaliar o processo conduzido durante o desenvolvimento e sugestão de melhorias. Criação do artefato <em>Backlog</em> da <em>sprint</em>
- **Review**: Reunião com objetivo de demonstrar as tarefas desenvolvidas, coleta e validação de <em>feedbacks</em>

Os ciclos de <em>sprints</em> são incrementais, utilizando os artefatos para gerenciamento das tarefas concluídas e priorização para próximas <em>sprints</em>.

### Artefatos

- <em>Backlog</em> do produto: funcionalidades a serem entregues no final do desenvolvimento do produto
- <em>Backlog</em> da <em>sprint</em>: funcionalidades desenvolvidas na <em>sprint</em>, a serem concluídas no <em>backlog</em> de produto

O código desenvolvido pela equipe é publicado no repositório do GitHub, seguindo as documentações para atingir qualidade e estrutura de código proposto pelo projeto. Os fluxos de trabalho utilizam Projects do GitHub, como quadro do projeto e gerenciamento das tarefas.

## Gerenciamento de Projeto
A metodologia ágil escolhida para o desenvolvimento deste projeto foi o SCRUM, pois como citam Amaral, Fleury e Isoni (2019, p. 68), seus benefícios são a

“visão clara dos resultados a entregar; ritmo e disciplina necessários à execução; definição de papéis e responsabilidades dos integrantes do projeto (Scrum Owner, Scrum Master e Team); empoderamento dos membros da equipe de projetos para atingir o desafio; conhecimento distribuído e compartilhado de forma colaborativa; ambiência favorável para crítica às ideias e não às pessoas.”

### Divisão de Papéis

A equipe utiliza o Scrum como base para definição do processo de desenvolvimento.
[Adicione informações abaixo sobre a divisão de papéis entre os membros da equipe.]
- **Scrum Master**: Vitor. *Responsável por garantir que a equipe trabalhe de forma eficiente afim de atingir os objetivos do projeto, removendo impedimentos e incentivando a colaboração*.
 - **Product Owner**: Lucas. *Responável pelo andamento do projeto priorizando o backlog do projeto para garnatir valor e qualidade para o cliente final*.
 - **Desenvolvedores**: Samuel, Breno, Matheus, Thais. *Responsável por criar e implementar as soluções do projeto atráves da escrita do código e realizacao de testes de qualidade*.
 - **Designer UX/UI**: Thais, Breno, Matheus. *Responsável por criar experiências digitais que sejam funcionais, intuitivas e visualmente agradáveis*.

### Processo
A condução do processo seguirá os rituais do <em>Scrum</em>, com a organização das tarefas e sua distribuição através do quadro de projeto no repositório da equipe utilizando <em>Kanban</em>(O Guia Oficial do Método Kanban, 2021). Processo será acompanhado, revisado e entregue seguindo os fluxos de trabalho e critérios estabelecidos. Todos os membros da equipe devem compreender e seguir as etapas, sendo transparentes e acessíveis para todos da equipe. A transição entre os fluxos de trabalho são lineares, somente sendo possível seguir com a próxima etapa ao concluir sua etapa anterior.

Fluxos de trabalho:

- **Backlog**: Tarefas aguardando para serem iniciadas, ainda sem priorização ou planejamento
- **Pronto para Iniciar**: Tarefas que foram priorizadas e estão prontas para serem trabalhadas pela equipe
- **Em Desenvolvimento**: Tarefas que estão em andamento e sendo desenvolvidas pela equipe
- **Pronto para Revisão**: Tarefas que foram desenvolvidas e estão aguardando revisão
- **Em Revisão**: Tarefas que estão sendo revisadas por outros membros da equipe
- **Concluídos**: Tarefas que foram revisadas e aceitas, prontas para serem implementadas na versão final

Critérios:

- **Backlog**: Levantamento dos requisitos e validados pela pessoa responsável de Produto(<em>Product Owner</em>), as tarefas serão inseridas no <em>backlog</em> através do ritual de <em>planning</em>
- **Pronto para Iniciar**: Tarefas que serão desenvolvidas na <em>sprint</em> atual, com <em>story points</em> definidos e atribuídas aos desenvolvedores da equipe
- **Em Desenvolvimento**: Tarefas em desenvolvimento serão testadas localmente e anexadas evidências nos cartões do quadro de projeto, efetuando <em>pull requests</em> para revisão
- **Pronto para Revisão**: Desenvolvedores de maior senioridade serão alocados para revisão das tarefas desenvolvidas
- **Em Revisão**: Qualidade e estrutura de código devem ser avaliadas seguindo as orientações da documentação "Padrões de Qualidade"
- **Concluídos**: Tarefas concluídas devem estar em conformidade com o prazo estipulado e serão aprovadas nos <em>pull requests</em>

### Etiquetas
<p>As tarefas são, ainda, etiquetadas em função da natureza da atividade e seguem o seguinte esquema de cores/categorias:</p>

<ul>
  <li>Bug (Erro no código)</li>
  <li>Desenvolvimento (Development)</li>
  <li>Documentação (Documentation)</li>
  <li>Gerência de Projetos (Project Management)</li>
  <li>Infraestrutura (Infrastructure)</li>
  <li>Testes (Tests)</li>
</ul>

<figure> 
  <img src="https://user-images.githubusercontent.com/100447878/164068979-9eed46e1-9b44-461e-ab88-c2388e6767a1.png"
    <figcaption>Tela do esquema de cores e categorias</figcaption>
</figure> 
  
### Ferramentas

Os artefatos do projeto são desenvolvidos a partir de diversas plataformas e a relação dos ambientes com seu respectivo propósito é apresentada na tabela que se segue.

| AMBIENTE                            | PLATAFORMA                         | LINK DE ACESSO                         |
|-------------------------------------|------------------------------------|----------------------------------------|
| Repositório de código fonte         | GitHub                             | [Save Money Project](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2025-1-e1-proj-web-t6-v2-pmv-ads-2025-1-e1-proj-savemoney)    |
| Documentos do projeto               | GitHub                             | [Save Money Docs](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2025-1-e1-proj-web-t6-v2-pmv-ads-2025-1-e1-proj-savemoney/tree/main/documentos)                        |
| Projeto de Interface                | Figma                              | [Save Money Designs](https://www.figma.com/design/KJUlXuhh651x4eYTHTaS67/Save-Money?t=BZWTdKMRHoPxlNX9-0)                         |
| Gerenciamento do Projeto            | GitHub Projects                    | http://....                            |
| Hospedagem                          | GitHub Pages                       | http://....                            | 
| Editor de código                    | Vs Code                            | https://code.visualstudio.com/         |
| Ferramenta de comunicação           | Teams                              |[Teams Save Money](https://teams.microsoft.com/l/team/19%3Ask_5zGaNOWj18BMvehhsFaqwEOMHbzfABKinNbOncAA1%40thread.tacv2/conversations?groupId=4e5ee42b-b56d-4589-862e-960158cb32cb&tenantId=14cbd5a7-ec94-46ba-b314-cc0fc972a161) |


### Estratégia de Organização de Codificação 

Todos os artefatos de desenvolvimento no projeto estarão organizados no diretório [codigo-fonte](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2025-1-e1-proj-web-t6-v2-pmv-ads-2025-1-e1-proj-savemoney/tree/main/codigo-fonte).
