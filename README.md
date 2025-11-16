# Mini Task Manager

task management app with authentication and CRUD tasks. Built with a Next.js frontend and a Node.js/Express backend using Prisma and PostgreSQL.

## Repo Structure
- `frontend/` – Next.js app (App Router)
- `backend/` – Node.js + TypeScript
- `docker-compose.yml` – Runs DB, backend, and frontend
## Setup

### Docker
1. From repo root run:
   ```bash
   docker compose up --build -d
   ```
2.. Open `http://localhost:3000` (frontend). Backend is at `http://localhost:4000`.


## API Endpoints
- `POST /auth/signup` → create user
- `POST /auth/login` → authenticate and set `token` cookie
- `POST /auth/logout` → clear cookie
- `GET /tasks` → list tasks for logged-in user
- `POST /tasks` → create task
- `PUT /tasks/:id` → update task
- `DELETE /tasks/:id` → delete task

## Tech Stack and Rationale
- Frontend: `Next.js`.
- Styling: Tailwind Css.
- Backend: `Express` + `TypeScript`.
- ORM: `Prisma ORM`
- DB: `PostgreSQL`
- Auth: JWT cookie;

## Trade-offs
- Used cookie-based JWT for authentication.
