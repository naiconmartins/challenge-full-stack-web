# +A Educação Challenge Frontend

Frontend do desafio **+A Educação - Full Stack Web Developer**, responsável pelo fluxo administrativo de gestão de alunos.

O projeto implementa a interface para:

- autenticação do usuário;
- listagem de alunos;
- cadastro de aluno;
- edição de aluno;
- exclusão com confirmação;
- tratamento de erros e notificações de sucesso.

## Stack

- Vue 3
- Vite
- TypeScript
- Vuetify
- Tailwind CSS
- Pinia
- Vue Router
- Axios
- Vitest

## Requisitos

- Node.js 22+ recomendado
- pnpm

## Configuração

Crie um arquivo `.env` na raiz do projeto com a URL da API:

```env
VITE_API_URL=http://localhost:3333
```

Essa variável é validada em tempo de execução em [src/config/env.ts](./src/config/env.ts).

## Instalação

```bash
pnpm install
```

## Executando em desenvolvimento

```bash
pnpm dev
```

A aplicação sobe por padrão na porta `3000`.

## Scripts

- `pnpm dev`: inicia o servidor de desenvolvimento
- `pnpm build`: executa `type-check` e build de produção
- `pnpm build-only`: gera o build sem rodar o `type-check`
- `pnpm preview`: publica localmente o build gerado
- `pnpm type-check`: valida a tipagem TypeScript com `vue-tsc`
- `pnpm test`: executa os testes unitários
- `pnpm test:watch`: executa os testes em modo watch

## Estrutura

- `src/views/`: telas principais da aplicação
- `src/components/`: componentes reutilizáveis de interface
- `src/composables/`: lógica de estado e comportamento por fluxo
- `src/services/`: integração com API orientada ao domínio
- `src/infra/`: infraestrutura compartilhada, como cliente HTTP
- `src/stores/`: estado global com Pinia
- `src/router/`: definição de rotas e guards
- `src/styles/`: estilos globais e configuração visual
- `src/types/`: contratos TypeScript

## Fluxos principais

### Login

- autenticação via API;
- persistência do token de acesso;
- guard para rotas autenticadas;
- tratamento central de expiração de sessão com redirecionamento para `/login`.

### Alunos

- listagem paginada;
- busca por termo;
- criação com validação de campos obrigatórios;
- edição com `RA` e `CPF` bloqueados;
- exclusão com modal de confirmação;
- mensagens globais de sucesso e erro.

## Arquitetura resumida

O frontend foi organizado para separar responsabilidades:

- `views` compõem a tela;
- `components` encapsulam a UI;
- `composables` concentram regras de fluxo;
- `services` encapsulam acesso HTTP;
- `stores` guardam estado global de autenticação.

Essa divisão facilita teste, manutenção e leitura do fluxo.

## Testes e qualidade

Comandos principais de validação:

```bash
pnpm type-check
pnpm test -- --runInBand
pnpm build-only
```

## Observações

- As decisões de arquitetura e observações de entrega estão documentadas em [COMMENTS.md](./COMMENTS.md).
