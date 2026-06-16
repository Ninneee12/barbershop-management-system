# The Sharp Cut — Barbershop Management System

Sistema de gerenciamento para barbearia com agendamentos, serviços e painel administrativo.  
Frontend em React, backend em Node.js/Express como função serverless e banco de dados PostgreSQL (Neon).

---

## Stack

| Camada   | Tecnologia                                      |
|----------|-------------------------------------------------|
| Frontend | React 19 + Vite + Tailwind CSS                  |
| Backend  | Node.js + Express (serverless via Vercel)        |
| Banco    | PostgreSQL via [Neon](https://neon.tech) (free tier) |
| Deploy   | [Vercel](https://vercel.com)                    |
| Idiomas  | Inglês e Português (i18n)                       |

---

## Como a aplicação funciona

O projeto é um **monorepo** com frontend e backend no mesmo repositório:

- **`src/`** — SPA React servida pelo Vite (build estático no deploy)
- **`server/index.js`** — API Express com todos os endpoints REST
- **`api/index.js`** — Entry point serverless que o Vercel usa em produção

Em **desenvolvimento local**, dois processos rodam em paralelo: o Vite (porta 5173) e o Express (porta 3001). O Vite possui um proxy configurado que redireciona chamadas `/api/*` para o Express, eliminando problemas de CORS.

Em **produção (Vercel)**, o Express é empacotado como uma única função serverless. Frontend e API ficam na mesma origem, sem necessidade de CORS.

---

## Pré-requisitos

- Node.js 18+
- Conta no [Neon](https://neon.tech) (gratuita) ou outro PostgreSQL acessível remotamente

---

## Passo a passo para rodar localmente

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd barbershop-management-system-1
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com sua connection string do Neon:

```env
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
PORT=3001
```

> Para obter a `DATABASE_URL`: acesse o painel do Neon → seu projeto → **Connection String**.

> `VITE_API_URL` não é mais necessária — em dev o proxy do Vite resolve automaticamente.

### 4. Rodar as migrations

Cria as tabelas e insere os dados iniciais de exemplo:

```bash
npm run migrate
```

### 5. Iniciar a aplicação

São necessários **dois terminais**:

**Terminal 1 — API (backend):**
```bash
npm run server
```
> API disponível em `http://localhost:3001`

**Terminal 2 — Frontend:**
```bash
npm run dev
```
> App disponível em `http://localhost:5173`

---

## Deploy na Vercel

### 1. Variáveis de ambiente

No painel da Vercel, configure:

| Variável       | Valor                                           |
|----------------|-------------------------------------------------|
| `DATABASE_URL` | Connection string do Neon                       |
| `PORT`         | Não é necessária (a Vercel define a porta)      |

### 2. Fazer o deploy

```bash
npx vercel
```

Ou conecte o repositório diretamente pelo painel em [vercel.com](https://vercel.com).  
A Vercel detecta o `vercel.json` e roteia `/api/*` para a função serverless automaticamente.

---

## Como usar

### Página Inicial
- Clique em **Book Slot** ou **Book Appointment** para agendar
- Clique em **Explore Services** para ver os serviços disponíveis
- Alterne entre idiomas com o botão **PT / EN** no canto superior direito

### Agendamento (Book Appointment)
O processo tem 4 etapas:

1. **Service** — Escolha o serviço desejado (Haircut, Beard, etc.)
2. **Barber** — Selecione o barbeiro de sua preferência
3. **Time** — Escolha a data e o horário disponível
4. **Client** — Preencha nome, telefone e e-mail para confirmar

Os horários já ocupados aparecem como **(Booked)** e ficam desabilitados.

### Serviços (Services)
- Lista todos os serviços com descrição, duração e preço
- Clique em **Book this Service** para ir direto ao agendamento com aquele serviço pré-selecionado

### Painel Admin (Admin Panel)
Acesso ao painel de gerenciamento com duas abas:

**Appointments:**
- Visualize todos os agendamentos
- Filtre por status: All / Pending / Completed / Cancelled
- Altere o status de cada agendamento com os botões de ação

**Services:**
- Visualize os serviços cadastrados
- Adicione novos serviços preenchendo nome, preço, duração e descrição
- Exclua serviços existentes com o botão de lixeira

---

## Scripts disponíveis

| Comando           | Descrição                                        |
|-------------------|--------------------------------------------------|
| `npm run dev`     | Inicia o frontend Vite em modo desenvolvimento   |
| `npm run server`  | Inicia a API Express localmente (porta 3001)     |
| `npm run migrate` | Aplica migrations no banco de dados              |
| `npm run build`   | Gera o build de produção do frontend             |
| `npm run lint`    | Verifica erros de lint                           |

---

## Endpoints da API

| Método   | Rota                              | Descrição                         |
|----------|-----------------------------------|-----------------------------------|
| `GET`    | `/health`                         | Status da API e conexão com banco |
| `GET`    | `/api/services`                   | Lista todos os serviços           |
| `POST`   | `/api/services`                   | Cria um novo serviço              |
| `DELETE` | `/api/services/:id`               | Remove um serviço                 |
| `GET`    | `/api/appointments`               | Lista todos os agendamentos       |
| `POST`   | `/api/appointments`               | Cria um novo agendamento          |
| `PATCH`  | `/api/appointments/:id/status`    | Atualiza status do agendamento    |

---

## Estrutura do projeto

```
barbershop-management-system/
├── api/
│   └── index.js              # Entry point serverless (Vercel)
├── server/
│   ├── index.js              # App Express (export default + guard listen)
│   ├── db.js                 # Conexão com PostgreSQL (pool)
│   ├── migrations/
│   │   └── 001_init.sql      # Schema + dados iniciais (seed)
│   └── scripts/
│       └── migrate.js        # Runner de migrations
├── src/
│   ├── App.jsx               # Componente raiz com estado global
│   ├── i18n.js               # Traduções PT/EN
│   ├── data.js               # Dados estáticos (barbeiros, horários)
│   ├── services/
│   │   └── api.js            # Client HTTP (URLs relativas)
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Services.jsx
│       ├── Booking.jsx
│       └── Dashboard.jsx
├── vercel.json               # Roteamento serverless + SPA fallback
├── vite.config.js            # Proxy /api → localhost:3001 em dev
├── .env.example              # Template de variáveis de ambiente
└── package.json
```
