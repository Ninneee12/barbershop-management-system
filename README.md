# Barbershop Management System

Base tecnica com:

- API minima para servicos e agendamentos
- PostgreSQL com migration e seed inicial
- Frontend React consumindo API

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Banco: PostgreSQL

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Configuracao

1. Instale dependencias:

```bash
npm install
```

2. Crie um arquivo `.env` com base em `.env.example`.

3. Garanta que o banco configurado em `DATABASE_URL` existe.

4. Rode as migrations (inclui seed inicial):

```bash
npm run migrate
```

## Execucao

1. Inicie a API:

```bash
npm run server
```

2. Em outro terminal, inicie o frontend:

```bash
npm run dev
```

## Endpoints minimos

- `GET /api/services`
- `POST /api/services`
- `DELETE /api/services/:id`
- `GET /api/appointments`
- `POST /api/appointments`
- `PATCH /api/appointments/:id/status`

## Estrutura backend

- `server/index.js`: API Express
- `server/db.js`: conexao com PostgreSQL
- `server/migrations/001_init.sql`: schema + seed
- `server/scripts/migrate.js`: runner de migrations
