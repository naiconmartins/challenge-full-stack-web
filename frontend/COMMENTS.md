# COMMENTS FRONT-END

## Decisão de arquitetura utilizada

Optei por organizar o frontend com separação de responsabilidades entre camadas mais voltadas à interface, ao fluxo de tela e à integração com a API.

Essa organização foi escolhida para evitar que regras de navegação, estado, componentes visuais e comunicação HTTP ficassem misturados no mesmo lugar. Com isso, cada parte da aplicação fica com um papel mais claro, o que facilita manutenção, testes e evolução do projeto.

- `views/` concentra a composição das telas.
- `components/` reúne componentes reutilizáveis de interface.
- `composables/` concentra regras de fluxo, validação e estado local.
- `services/` encapsula integrações orientadas ao domínio, como autenticação e alunos.
- `infra/` concentra infraestrutura compartilhada, como o cliente HTTP base.
- `stores/` mantém estado global de autenticação.

Escolhi essa estrutura porque ela reduz acoplamento entre interface e integração com API, facilita testes unitários e deixa os fluxos principais mais fáceis de manter.

## Lista de bibliotecas de terceiros utilizadas

- `pinia` para estado global de autenticação.
- `axios` para cliente HTTP, interceptors e tratamento centralizado de erros.
- `zod` para validação da variável de ambiente `VITE_API_URL`.
- `tailwindcss` para utilitários de layout e espaçamento, em conjunto com Vuetify.
- `vitest` e `@vue/test-utils` para testes unitários.
- `happy-dom` como ambiente de execução dos testes.
- `@mdi/font` para ícones.

## Observação sobre Git

O desenvolvimento deste desafio foi conduzido diretamente na branch `main`, com foco em commits semânticos e agrupados por contexto de alteração. Em um cenário de equipe, eu adotaria branches curtas por funcionalidade e revisão via pull request.

## O que eu melhoraria se tivesse mais tempo

- Adicionaria testes E2E cobrindo login, listagem, criação, edição e exclusão.
- Refinaria a experiência de sessão expirada, diferenciando melhor falha de credencial no login e expiração da autenticação durante o uso da aplicação.
- Adicionaria gestão de usuários administrativos.

## Quais requisitos obrigatórios não foram entregues

No recorte de frontend, todos os requisitos obrigatórios funcionais foram entregues:

- listagem de alunos;
- cadastro de aluno;
- edição de aluno;
- exclusão com confirmação;
- validação dos campos obrigatórios;
- bloqueio de edição de RA e CPF no modo de edição.
