# WebChat Lindo do Bolivar muito Lindo!

- Escopo do projeto;
-

---

## Requisitos Obrigatórios:

### 1 - Sua aplicação deverá ter um back-end que permite que várias pessoas se conectem simultâneamente e mandem mensagens em um chat

##### As seguintes verificações serão feitas:

- A aplicação deverá permitir que vários clientes se conectem a um chat ao mesmo tempo;

- Cada cliente conectado ao chat deverá receber todas as mensagens que já foram enviadas no chat;

- Toda mensagem que um cliente recebe deve conter as informações acerca de quem a enviou, data-hora do envio e o conteúdo da mensagem em si. A data-hora das mensagens deve ser determinada pelo momento em que são salvas no banco de dados (ver requisito 3).

### 2 - Sua aplicação deverá ter um front-end em que quem usa consiga interagir com o chat

##### As seguintes verificações serão feitas:

- O front-end deve exibir todas as mensagens já enviadas no chat, mantendo as mais recentes na parte debaixo da tela;

- O front-end deve ter uma caixa de texto através da qual quem usa consiga enviar mensagens para o chat;

- O front-end deve permitir a quem usa escolher um apelido (_nickname_) para si. Para que o cliente consiga escolher um apelido deve ter um campo de texto e um botão no front-end. O campo de texto será onde o cliente digitará o _nickname_ que deseja. Após escolher o _nickname_, o cliente deverá clicar no botão para que o dado seja salvo no `MongoDB`.

### 3 - O histórico do chat deverá persistir mesmo que o servidor do chat seja fechado e reaberto

##### As seguintes verificações serão feitas:

- Você deve configurar um banco de dados MongoDB, onde cada linha contém uma mensagem enviada;

- O seu banco de dados deve salvar o nickname de quem enviou a mensagem, a mensagem em si e uma _timestamp_ com precisão de segundos de quando ela foi salva no banco.

### 4 - Sua aplicação deve enviar uma _push notification_ aos clientes quando uma nova mensagem chegar no chat

##### As seguintes verificações serão feitas:

- Quando uma nova mensagem chegar no chat, todos os clientes deverão receber uma push notification com tal alerta.

### 5 - O seu back-end deve ter 100% de cobertura de testes automatizados

##### As seguintes verificações serão feitas:

- A cobertura de testes do back-end deve ser de 100%;

- Se qualquer uma das funções do seu back-end tiver o conteúdo apagado os seus testes devem quebrar.

## Requisitos Bônus

### 6 - Sua aplicação deverá informar a todos os clientes quem está online num dado momento

##### As seguintes verificações serão feitas:

- No front-end deve haver uma lista, na tela de cada cliente, que mostra quais clientes estão online em um dado momento. Um cliente é identificado pelo seu _nickname_.

### 7 - Sua aplicação deverá permitir a quem usa trocar mensagens particulares

##### As seguintes verificações serão feitas:

- No front-end deve haver uma lista com todos os clientes e, ao lado de cada identificador, um botão. Um clique nesse botão deve direcionar as pessoas para um chat privado;

- No front-end deve ser possível navegar entre os chats privados ou o chat geral numa mesma janela;

- Mensagens particulares só devem ser visíveis para as partes pertinentes. Clientes terceiros não devem poder acessar seu conteúdo.

### 8 - O seu front-end deve ter 100% de cobertura de testes automatizados

##### As seguintes verificações serão feitas:

- A cobertura de testes do front-end deve ser de 100%;

- Se qualquer uma das funções do seu front-end tiver o conteúdo apagado os seus testes devem quebrar.

---

## Dicas

- Para colocar sua página no [GitHub Pages](https://pages.github.com/), não é necessário remover o conteúdo que já está lá, você pode apenas adicionar essa nova página. Para isso, todo o conteúdo desse projeto deve ser colocado em uma pasta `/projetos/todo-list`;

- Tomar decisões de projeto em prol do bom desenvolvimento faz parte do projeto! Interprete os requisitos, tome suas decisões e, em caso de dúvidas, valide-as conosco no _Slack_!

---

### DURANTE O DESENVOLVIMENTO

- ⚠ **RECOMENDAMOS QUE VOCÊ FIQUE ATENTO ÀS ISSUES DO CODE CLIMATE, PARA RESOLVÊ-LAS ANTES DE FINALIZAR O DESENVOLVIMENTO.** ⚠

- Faça `commits` das alterações que você fizer no código regularmente;

- Lembre-se de sempre após um ~~(ou alguns)~~ `commits` atualizar o repositório remoto (o famoso `git push`);

- Os comandos que você utilizará com mais frequência são:

  1. `git status` _(para verificar o que está em vermelho - fora do stage - e o que está em verde - no stage)_;

  2. `git add` _(para adicionar arquivos ao stage do Git)_;

  3. `git commit` _(para criar um commit com os arquivos que estão no stage do Git)_;

  4. `git push -u nome-da-branch` _(para enviar o commit para o repositório remoto na primeira vez que fizer o `push` de uma nova branch)_;

  5. `git push` _(para enviar o commit para o repositório remoto após o passo anterior)_.

---

### DEPOIS DE TERMINAR O DESENVOLVIMENTO (OPCIONAL)

Para sinalizar que o seu projeto está pronto para o _"Code Review"_ dos seus colegas, faça o seguinte:

- Vá até a página **DO SEU** _Pull Request_, adicione a label de _"code-review"_ e marque seus colegas:

  - No menu à direita, clique no _link_ **"Labels"** e escolha a _label_ **code-review**;

  - No menu à direita, clique no _link_ **"Assignees"** e escolha **o seu usuário**;

  - No menu à direita, clique no _link_ **"Reviewers"** e digite `students`, selecione o time `tryber/students-sd-0x`.

Caso tenha alguma dúvida, [aqui tem um video explicativo](https://vimeo.com/362189205).

---

### REVISANDO UM PULL REQUEST

Use o conteúdo sobre [Code Review](https://course.betrybe.com/real-life-engineer/code-review/) para te ajudar a revisar os _Pull Requests_.

#VQV 🚀
