# Funcionalidades Principais
## 1. Cadastro, Edição e Exclusão de Despesas e Receitas
> - Cadastro:
O usuário pode adicionar novas despesas e receitas através de modais específicos. Campos obrigatórios são validados antes do salvamento.
![a](https://github.com/user-attachments/assets/a5825c23-522c-4aaf-a3e4-24a990d3719a)

> - Edição:
É possível editar qualquer item existente, com histórico de alterações salvo para auditoria.
![b](https://github.com/user-attachments/assets/b275b3e6-aa84-4561-b1ae-63a4bc229996)


> -Exclusão:
A exclusão exige confirmação via modal, garantindo que ações críticas não sejam realizadas acidentalmente.
![c](https://github.com/user-attachments/assets/5487fddc-4155-42eb-a794-d5c69f95bc5d)


## 2. Marcação de Pagamento/Recebimento
> - Despesas:
O usuário pode marcar uma despesa como paga. Ao clicar no botão correspondente, um modal de confirmação é exibido. Após confirmação, o status é atualizado no banco local e na interface.

![f](https://github.com/user-attachments/assets/1442d595-db20-4be2-a5af-032cc0c4dc76)
![g](https://github.com/user-attachments/assets/58bb9de8-3559-4f55-ae86-87b7cf8583f6)



> - Receitas:
O usuário pode marcar uma receita como recebida ou cancelar o recebimento, com ícones e textos intuitivos.

![d](https://github.com/user-attachments/assets/cd281ff3-cc7b-4b97-89ff-2f79bbd9d5da)
![e](https://github.com/user-attachments/assets/a5e6f3a4-83de-42fb-ae1b-a29cf7b6ef88)


## 3. Despesas e Receitas Recorrentes
> - Configuração:
Ao cadastrar uma despesa ou receita, o usuário pode definir recorrência (diária, semanal, mensal, anual) e o número de repetições.
> - Geração automática:
O sistema gera automaticamente as próximas ocorrências conforme a configuração, até atingir o limite definido ou a data final.
> - Validação:
Para recorrências, a data final se torna obrigatória.

![h](https://github.com/user-attachments/assets/aaab77a8-66a9-445d-956d-d7f130ccbf12)
![i](https://github.com/user-attachments/assets/7eabb3a0-b70e-4151-94a2-760ea48b2937)

## 4. Filtros e Ordenação
> - Filtros:
O usuário pode filtrar despesas/receitas por status (todas, pagas, pendentes, atrasadas, recorrentes) e por período.
> - Ordenação:
É possível ordenar por valor ou data, crescente ou decrescente.
![j](https://github.com/user-attachments/assets/3d676c9b-2259-49d8-a212-6b3a1089fb7b)

## 5. Histórico de Alterações
Cada alteração relevante (edição, pagamento, recebimento, exclusão) é registrada no histórico do item, permitindo rastreabilidade.

![a](https://github.com/user-attachments/assets/fc1a2439-7abd-4558-8e14-9ca62cce63af)




## 6. Feedback ao Usuário
> - Toasts:
Mensagens rápidas informam sucesso, erro ou alerta em cada ação.

![l](https://github.com/user-attachments/assets/3c405bb7-aa16-4775-9fae-7a78fb5ca626)


> - Modais:
Todas as ações críticas (exclusão, pagamento, exportação) exigem confirmação via modal.

![m](https://github.com/user-attachments/assets/ba6899ae-767c-45c3-aea9-f30c6ee5d87d)




> **Links Úteis**:
> - [Trabalhando com HTML5 Local Storage e JSON](https://www.devmedia.com.br/trabalhando-com-html5-local-storage-e-json/29045)
> - [JSON Tutorial](https://www.w3resource.com/JSON)
> - [JSON - Introduction (W3Schools)](https://www.w3schools.com/js/js_json_intro.asp)
> - [JSON Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/json/index.htm)

