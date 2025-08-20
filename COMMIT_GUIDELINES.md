### **Guia de Commits Semânticos - Save Money**  

Para manter um histórico de commits claro e padronizado no projeto **Save Money**, seguimos a convenção de **Commits Semânticos**. Isso facilita a leitura do histórico, a colaboração e a automação de changelogs.  

#### **Formato do Commit**  
```
<tipo>(<escopo opcional>): <mensagem breve>
```
- **`<tipo>`**: O propósito da mudança (ex: `feat`, `fix`, `docs`, etc.).  
- **`<escopo opcional>`**: A parte do código alterada (ex: `auth`, `api`, `ui`).  
- **`<mensagem breve>`**: Descrição clara e objetiva da mudança.  

#### **Tipos de Commits Comuns**  
| Tipo        | Descrição |
|-------------|------------|
| `feat`      | Nova funcionalidade |
| `fix`       | Correção de bug |
| `docs`      | Atualizações na documentação |
| `style`     | Ajustes de formatação e estilo (sem alteração lógica) |
| `refactor`  | Refatoração sem mudanças funcionais |
| `test`      | Adição ou alteração de testes |
| `chore`     | Tarefas de manutenção sem impacto no código |
| `perf`      | Melhorias de desempenho |
| `ci`        | Alterações em CI/CD |
| `build`     | Ajustes na build do projeto |

#### **Exemplos de Commits**
```bash
feat(auth): adiciona suporte a login com Google
fix(api): corrige erro na validação de token
docs(readme): adiciona instruções de instalação
chore(deps): atualiza dependências do projeto
```

Sempre utilize mensagens claras e objetivas para garantir um histórico bem organizado.  

Obrigado por contribuir com o **Save Money**!