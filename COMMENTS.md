# COMMENTS

Este arquivo resume a resolução do desafio no nível da aplicação completa. Os detalhes específicos de cada camada estão nos arquivos abaixo:

- Frontend: [frontend/COMMENTS.md](./frontend/COMMENTS.md)
- Backend: [backend/COMMENTS.md](./backend/COMMENTS.md)

## Visão geral

Para facilitar a avaliação da solução, optei por disponibilizar toda a aplicação com `docker compose`, incluindo banco de dados, backend e frontend. A ideia foi reduzir o esforço necessário para executar o projeto e, ao mesmo tempo, deixar explícita a sequência de inicialização da stack.

Além da execução isolada de frontend e backend, preparei uma orquestração única para que o ambiente seja montado de forma previsível e reproduzível. Esse fluxo segue a ordem abaixo:

1. subir o PostgreSQL;
2. aguardar o healthcheck do banco;
3. construir a imagem do backend com cache de dependências;
4. executar os testes do backend durante o build;
5. rodar as migrations;
6. rodar o seed inicial;
7. subir a API;
8. construir e subir o frontend.

## Como executar com Docker Compose

Na raiz do projeto, a execução principal pode ser feita com:

```bash
docker compose up --build
```

Centralizei essa orquestração no arquivo [docker-compose.yml](./docker-compose.yml), permitindo subir toda a solução com um único comando.

Como apoio à execução local, também incluí o script abaixo:

```bash
./scripts/up.sh
```

Esse script executa o `docker compose up --build -d`, aguarda os serviços HTTP ficarem disponíveis e exibe ao final as URLs principais do ambiente, oferecendo uma confirmação mais objetiva de que a subida foi concluída com sucesso.

## Serviços expostos

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3333`
- Swagger: `http://localhost:3333/docs/`
- PostgreSQL: `localhost:5433`

## Como a orquestração foi implementada

### Banco de dados

O serviço `postgres` utiliza a imagem `postgres:16-alpine`, com volume nomeado para persistência. Na máquina host, a porta publicada foi configurada como `5433`, evitando conflito com uma instalação local padrão de PostgreSQL na porta `5432`.

Também configurei um `healthcheck` com `pg_isready`, para garantir que os serviços dependentes só avancem quando o banco estiver realmente pronto para receber conexões.

### Backend

No `compose`, o backend foi dividido em três etapas:

- `backend-migrate`: roda `pnpm migration:run:prod`
- `backend-seed`: roda `pnpm seed:run:prod`
- `backend`: sobe a aplicação principal

Essa separação foi importante para evitar que a API seja iniciada antes de o schema do banco e os dados mínimos estarem preparados.

O [backend/Dockerfile](./backend/Dockerfile) foi montado com múltiplos estágios:

- instalação de dependências com cache do `pnpm`;
- execução de testes;
- build da aplicação;
- montagem da imagem final com dependências de produção.

Com essa estratégia, o pipeline falha cedo caso os testes do backend não passem, o que impede a publicação de uma imagem inválida para o restante do fluxo.

### Seed inicial

O seed do backend está em [backend/src/scripts/seed.ts](./backend/src/scripts/seed.ts).

Esse script cria ou atualiza:

- um usuário administrativo inicial;
- uma carga inicial de alunos brasileiros.

O comportamento é idempotente por meio de `upsert`, evitando duplicação caso o processo seja executado novamente.

### Frontend

O frontend é construído em imagem própria e servido por `nginx`, mantendo a entrega simples e adequada para o contexto do desafio.

Durante o build, a variável `VITE_API_URL` é injetada para apontar para a API disponível em `http://localhost:3333`.

Também configurei o `nginx` com fallback para `index.html`, permitindo o funcionamento correto das rotas da SPA.

## Credenciais iniciais

- Email: `admin@grupoa.com.br`
- Senha: `admin@123`

## Observações finais

- O ambiente pode ser encerrado com `docker compose down`.
- Para remover também o volume de dados do banco, o comando é `docker compose down -v`.
- Se for necessário reconstruir as imagens sem reaproveitar camadas locais, o comando é `docker compose build --no-cache`.
