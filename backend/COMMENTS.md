# COMMENTS

## Decisão da arquitetura utilizada

Optei por organizar o backend em uma arquitetura modular em camadas, separando responsabilidades entre `domain`, `application` e `infrastructure`.

Além da separação por camadas, a aplicação também foi dividida por módulos de negócio, principalmente `students` e `users`.

- O módulo `students` concentra o núcleo funcional do desafio, ou seja, cadastro, listagem, consulta, edição e exclusão de alunos.
- O módulo `users` concentra a parte administrativa de autenticação e gerenciamento de usuários responsáveis por operar o sistema.

Essa divisão foi escolhida para que cada contexto do sistema ficasse isolado e com responsabilidades bem definidas. Com isso, regras, casos de uso, controllers, schemas e repositórios de alunos não ficam misturados com os de autenticação e usuários administrativos. Essa organização facilita manutenção, testes e evolução do sistema, especialmente se no futuro surgirem novos módulos como matrículas, turmas ou relatórios.

- A camada `domain` concentra os contratos, modelos e erros de negócio. A escolha aqui foi manter as regras mais importantes desacopladas de framework, banco e HTTP.
- A camada `application` concentra os casos de uso. Essa decisão foi tomada para deixar cada ação do sistema com uma responsabilidade clara, por exemplo: criar aluno, atualizar aluno, buscar aluno, autenticar usuário.
- A camada `infrastructure` concentra tudo que depende de tecnologia específica, como Express, TypeORM, middlewares, providers, schemas de validação e repositórios concretos.

Escolhi essa estrutura porque ela melhora a legibilidade do projeto, facilita testes unitários, reduz acoplamento e deixa a evolução do sistema mais previsível.

Também utilizei injeção de dependência com `tsyringe`. A escolha foi feita para evitar que controllers e casos de uso criem dependências diretamente, o que facilita substituição por mocks nos testes e reduz acoplamento entre camadas.

Na persistência, utilizei `TypeORM` com migrations e `PostgreSQL`. A decisão por migrations foi importante para explicitar a evolução do esquema do banco e permitir reproducibilidade do ambiente, em vez de depender apenas de geração automática de tabelas.

Na entrada de dados, centralizei validações com `Zod`. A escolha foi para validar payloads e parâmetros antes da regra de negócio, retornando erros consistentes para a API.

Como diferencial de segurança, implementei autenticação com `JWT` e revogação de token no logout. O desafio trata isso como diferencial, então a decisão foi incluir uma camada de autenticação simples, mas suficiente para demonstrar preocupação com segurança da aplicação.

## Lista de bibliotecas de terceiros utilizadas

- `express`: foi utilizado para estruturar a camada HTTP da aplicação de forma simples e consolidada no ecossistema Node.js, permitindo criar rotas, middlewares e tratamento de requisições com pouca complexidade.
- `cors`: foi utilizado para habilitar o consumo da API por clientes externos, especialmente o frontend, evitando bloqueios de origem cruzada no navegador.
- `typeorm`: foi escolhido para mapear entidades, organizar repositórios e controlar migrations do banco, facilitando a persistência sem abrir mão de uma modelagem orientada a objetos.
- `pg`: foi utilizado por ser o driver necessário para conectar a aplicação ao PostgreSQL.
- `reflect-metadata`: foi utilizado porque `TypeORM` e os decorators do projeto dependem dessa biblioteca para funcionamento correto do metadata em tempo de execução.
- `zod`: foi escolhido para validar dados de entrada de forma declarativa e centralizada, garantindo mensagens de erro consistentes antes da execução da regra de negócio.
- `tsyringe`: foi utilizado para implementar injeção de dependência, reduzindo acoplamento entre controllers, casos de uso, providers e repositórios.
- `jsonwebtoken`: foi escolhido para geração e validação de tokens JWT, atendendo ao diferencial de segurança com autenticação baseada em token.
- `bcryptjs`: foi utilizado para hash de senha e verificação segura no processo de autenticação.
- `swagger-jsdoc`: foi utilizado para gerar a especificação da API a partir de anotações no código, facilitando manter documentação e implementação próximas.
- `swagger-ui-express`: foi escolhido para disponibilizar uma interface visual da documentação, tornando a API mais fácil de testar e inspecionar.
- `dotenv`: foi utilizado para carregar variáveis de ambiente no código, especialmente na configuração centralizada de ambiente.

### Bibliotecas de apoio ao desenvolvimento e qualidade

- `jest`: foi utilizado como framework principal de testes por ser amplamente adotado, simples de configurar e adequado para testes unitários e de integração.
- `ts-jest`: foi escolhido para permitir a execução dos testes diretamente em TypeScript, sem necessidade de uma etapa separada de compilação para testar.
- `typescript`: foi utilizado para adicionar tipagem estática ao projeto, melhorando segurança de refatoração, legibilidade e manutenção.
- `ts-node-dev`: foi utilizado para executar a aplicação em desenvolvimento com recarga automática, acelerando o ciclo de implementação.
- `tsconfig-paths`: foi utilizado para permitir o uso dos aliases de import definidos no projeto durante a execução em desenvolvimento.
- `dotenv-cli`: foi utilizado nos scripts do `package.json` para carregar arquivos `.env` e `.env.test` antes de subir a aplicação ou executar testes.
- `eslint`: foi utilizado para análise estática do código, ajudando a manter consistência, prevenir erros simples e reforçar qualidade.
- `@eslint/js`: foi utilizado como base das regras recomendadas do ESLint para JavaScript.
- `typescript-eslint`: foi utilizado para adaptar o ESLint ao código TypeScript, permitindo regras específicas da linguagem.
- `eslint-plugin-prettier`: foi utilizado para integrar verificação de formatação do Prettier ao processo de lint.
- `eslint-config-prettier`: foi utilizado para evitar conflito entre regras de lint e formatação.
- `globals`: foi utilizado na configuração do ESLint para declarar conjuntos de variáveis globais do ambiente.
- `prettier`: foi escolhido para padronizar formatação automaticamente e evitar divergências de estilo no projeto.

## O que eu melhoraria se tivesse mais tempo

- Adicionaria testes end-to-end cobrindo o fluxo HTTP completo, não apenas testes unitários e de integração.
- Adicionaria logging estruturado para facilitar rastreabilidade e diagnóstico de erro em ambiente real.
- Criaria uma estratégia mais completa de auditoria para ações administrativas, como criação, edição e exclusão de alunos.

## Quais requisitos obrigatórios que não foram entregues

No escopo do backend, os principais requisitos de cadastro, listagem, edição, exclusão, validação, tratamento de erros, persistência e autenticação foram contemplados.
