# GCS Todo (Full-stack)

This is a full-stack Todo application (TypeScript) with:
- Frontend: Vite + React + Redux Toolkit (TypeScript)
- Backend: Node + Express (TypeScript) with an in-memory store

## Requirements
- Node.js 18+ recommended

## Setup

1. Install frontend dependencies

```bash
cd gcs-todo
npm install
```

2. Install backend dependencies

```bash
cd server
npm install
```

## Run

Start backend (dev):

```bash
cd gcs-todo
npm run dev:server
# or
cd server && npm run dev
```

Start frontend (Vite):

```bash
cd gcs-todo
npm run dev
```

Open `http://localhost:5173` and the frontend will call the backend at `http://localhost:4000/api` by default.

## What I implemented
- REST API for todos and categories (in `server/`) with TypeScript
- CRUD operations for todos and categories
- Frontend React components for listing, creating, editing and deleting todos and categories
- Redux Toolkit slices for `todos` and `categories`

## Notes
- The backend uses an in-memory store; data will reset when the server restarts.
