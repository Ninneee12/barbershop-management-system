# The Sharp Cut — Barbershop Management System

Sistema de gerenciamento para barbearia com agendamentos, serviços e painel administrativo. Frontend em React, backend em Node.js/Express e banco de dados PostgreSQL (Neon).

---

## Stack

| Camada   | Tecnologia                        |
|----------|-----------------------------------|
| Frontend | React 19 + Vite + Tailwind CSS    |
| Backend  | Node.js + Express                 |
| Banco    | PostgreSQL via Neon (free tier)   |
| Idiomas  | Inglês e Português (i18n)         |

---

## Pré-requisitos

- Node.js 18+
- Conta no [Neon](https://neon.tech) (gratuita) ou outro PostgreSQL

---

## Configuração inicial

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o `.env` com sua connection string do Neon:

```env
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
PORT=3001
VITE_API_URL=http://localhost:3001
```

> Para obter a `DATABASE_URL`: acesse o painel do Neon → seu projeto → **Connection String**.

### 3. Rodar as migrations

Cria as tabelas e insere dados iniciais de exemplo:

```bash
npm run migrate
```

---

## Executando a aplicação

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

## Como usar

### Página Inicial
- Acesse `http://localhost:5173`
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

| Comando           | Descrição                               |
|-------------------|-----------------------------------------|
| `npm run dev`     | Inicia o frontend em modo desenvolvimento |
| `npm run server`  | Inicia a API Express                    |
| `npm run migrate` | Aplica migrations no banco de dados     |
| `npm run build`   | Gera o build de produção do frontend    |
| `npm run lint`    | Verifica erros de lint                  |

---

## Endpoints da API

| Método   | Rota                              | Descrição                        |
|----------|-----------------------------------|----------------------------------|
| `GET`    | `/health`                         | Status da API e conexão com banco |
| `GET`    | `/api/services`                   | Lista todos os serviços          |
| `POST`   | `/api/services`                   | Cria um novo serviço             |
| `DELETE` | `/api/services/:id`               | Remove um serviço                |
| `GET`    | `/api/appointments`               | Lista todos os agendamentos      |
| `POST`   | `/api/appointments`               | Cria um novo agendamento         |
| `PATCH`  | `/api/appointments/:id/status`    | Atualiza status do agendamento   |

---

## Estrutura do projeto

```
barbershop-management-system/
├── server/
│   ├── index.js              # API Express com todos os endpoints
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
│   │   └── api.js            # Client HTTP para comunicação com a API
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Services.jsx
│       ├── Booking.jsx
│       └── Dashboard.jsx
├── .env.example              # Template de variáveis de ambiente
└── package.json
```
