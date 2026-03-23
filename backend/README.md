# Backend - Student Registration API

API REST em Node.js para gerenciamento de alunos e autenticação de usuários administrativos do desafio `+A Educação - Full Stack Web Developer`.

## Objetivo

Este backend cobre o escopo de API do desafio:

- cadastro de alunos
- listagem paginada de alunos
- consulta por id
- edição de aluno
- exclusão de aluno
- validação de dados
- persistência em banco relacional
- autenticação de usuário administrativo

Além do CRUD de alunos, o projeto inclui documentação Swagger, testes unitários e testes de integração.

## Stack

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- Zod
- JWT
- Jest

## Arquitetura

O projeto foi organizado de forma modular e em camadas:

- `domain`: contratos, modelos e regras centrais
- `application`: casos de uso
- `infrastructure`: HTTP, banco, providers, schemas e repositórios

Módulos principais:

- `students`: regras e endpoints de alunos
- `users`: autenticação e usuários administrativos

Detalhes de arquitetura e decisões técnicas estão em [COMMENTS.md](./COMMENTS.md).

## Requisitos

- Node.js 20+
- pnpm
- PostgreSQL 14+

## Variáveis de ambiente

Use o arquivo `.env.example` como base:

```env
PORT=3333
NODE_ENV=development
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_SCHEMA=public
DB_NAME=grupoa
DB_USER=postgres
DB_PASS=postgres
JWT_SECRET=my_secret
JWT_EXPIRES_IN=86400
```

## Instalação

```bash
pnpm install
cp .env.example .env
```

## Banco de dados

Crie um banco PostgreSQL e ajuste as credenciais no `.env`.

Depois execute as migrations:

```bash
pnpm migration:run
```

## Subindo a aplicação

Ambiente de desenvolvimento:

```bash
pnpm dev
```

Build de produção:

```bash
pnpm build
pnpm start
```

Servidor padrão:

- API: `http://localhost:3333`
- Swagger: `http://localhost:3333/docs`

## Endpoints principais

Autenticação:

- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

Usuários administrativos:

- `POST /users`

Alunos:

- `POST /students`
- `GET /students`
- `GET /students/:id`
- `PUT /students/:id`
- `DELETE /students/:id`

## Testes

Testes unitários:

```bash
pnpm test
```

Testes de integração:

```bash
pnpm test:int
```
