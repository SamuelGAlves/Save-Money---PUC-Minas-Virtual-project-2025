# Save Money - Código Fonte

Este diretório contém o código fonte do sistema Save Money, uma aplicação web para gestão financeira pessoal e empresarial.

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Service Workers (PWA)
- Local Storage
- IndexedDB
- i18n (Internacionalização)
- Web Components
- CSS Variables (Temas)

## Funcionalidades Implementadas

- **Autenticação de Usuários**
  - Login e registro de usuários
  - Recuperação de senha
  - Perfil do usuário
  - Edição de dados pessoais

- **Gestão Financeira**
  - Cadastro de receitas e despesas
  - Investimentos com cálculo de juros
  - Conversor de moedas em tempo real
  - Histórico de transações
  - Filtros e busca avançada

- **Recursos Técnicos**
  - Aplicação PWA (Progressive Web App)
  - Armazenamento offline
  - Sincronização de dados
  - Interface responsiva
  - Suporte a múltiplos idiomas
  - Tema claro/escuro
  - Design System próprio

## Como Executar

1. Clone o repositório
2. Abra o arquivo `index.html` em seu navegador
3. Para desenvolvimento, recomenda-se usar um servidor local
4. Para testar o PWA, use um servidor HTTPS

## PWA

O Save Money é uma Progressive Web App (PWA), o que significa que você pode:
- Instalar no seu dispositivo
- Usar offline
- Receber notificações
- Acessar como um aplicativo nativo
- Sincronizar dados automaticamente

## Armazenamento

- Utiliza IndexedDB para armazenamento local
- Service Workers para cache e funcionamento offline
- Sincronização automática quando online
- Cache de recursos estáticos
- Persistência de dados do usuário

## Interface

- Design responsivo
- Tema claro/escuro
- Interface intuitiva e moderna
- Acessibilidade implementada
- Suporte a múltiplos idiomas:
  - Português (BR)
  - Inglês (US)
  - Espanhol (ES)
  - Francês (FR)
  - Hindi (IN)
  - Russo (RU)
  - Chinês (CN)
  - Árabe (SA)
  - Zulu (ZA)

## Notas de Desenvolvimento

- Código modular e organizado
- Padrões de projeto SPA e Web Componentes
- Boas práticas de desenvolvimento web
- Sistema de temas com CSS Variables
- Componentes reutilizáveis
- Internacionalização de idiomas
- Cache inteligente com Service Workers
