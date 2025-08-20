# Template padrão da Aplicação

# Organização dos Arquivos
> - Cada módulo (despesas, receitas, relatórios) possui sua própria pasta, com subpastas para componentes, modais e o arquivo principal da página (page.js).
> - Componentes são Web Components customizados, reutilizáveis e encapsulados.
> - Modais são componentes próprios, podendo ser específicos ou genéricos.
> - Store centraliza o acesso ao IndexedDB e gerencia o estado global.
> - Utils contém funções utilitárias (datas, moedas, recorrência, etc).
> - Services para integrações externas ou serviços auxiliares.

# Padrão de Componentização
> - Web Components: Todos os elementos visuais reutilizáveis são implementados como custom elements.
> - Shadow DOM: Utilizado para encapsular estilos e evitar conflitos globais.
> - Eventos Customizados: Comunicação entre componentes via eventos customizados.

# Fluxo SPA (Single Page Application)
> - Roteamento: O roteador carrega dinamicamente cada página (page.js) conforme a rota, usando import dinâmico.
> - Renderização: Cada página monta seu próprio template HTML e injeta seus componentes/modais necessários.
> - Atualização de Estado: Mudanças (criar, editar, pagar, excluir) disparam eventos que atualizam o IndexedDB e recarregam a lista e totais.

# Padrão de Modais
> - Cada ação importante tem seu modal (ex: confirmação de exclusão, confirmação de pagamento, criação/edição).
> - Modais são registrados como custom elements e adicionados ao template da página.
> - Abertura e fechamento controlados por métodos públicos (open, close).

# Boas Práticas Adotadas
> - Encapsulamento de estilos e lógica via Shadow DOM.
> - Separação de responsabilidades: cada componente/modal cuida apenas de sua função.
> - Reutilização de código: componentes e utilitários reaproveitados em diferentes páginas.
> - Internacionalização (i18n): textos e labels centralizados para fácil tradução.
> - Feedback ao usuário: uso de toasts e modais para confirmações e erros.



> **Links Úteis**:
>
> - [CSS Website Layout (W3Schools)](https://www.w3schools.com/css/css_website_layout.asp)
> - [Website Page Layouts](http://www.cellbiol.com/bioinformatics_web_development/chapter-3-your-first-web-page-learning-html-and-css/website-page-layouts/)
> - [Perfect Liquid Layout](https://matthewjamestaylor.com/perfect-liquid-layouts)
> - [How and Why Icons Improve Your Web Design](https://usabilla.com/blog/how-and-why-icons-improve-you-web-design/)
