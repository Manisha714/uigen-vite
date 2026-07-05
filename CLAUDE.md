# UIGen — Claude Cheat Sheet

## Quick Start

1. `npm run setup` — install, generate Prisma client, migrate DB
2. Copy `.env` and add AWS keys or `ANTHROPIC_API_KEY` (optional; mock provider works without keys)
3. `npm run dev` — start Vite (5173) + Express (3001)
4. Open `http://localhost:5173`

## Stack

- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS
- **Backend**: Express.js on port 3001
- **Database**: Prisma + SQLite
- **AI**: Vercel AI SDK (Bedrock / Anthropic / Mock)
- **Editor**: Monaco Editor
- **Preview**: `@babel/standalone` in-browser JSX transpilation

## Common Commands

```bash
npm run dev          # Vite + Express concurrently
npm run dev:server   # Express only
npm run dev:client   # Vite only
npm run build        # Build frontend
npm run setup        # Install, prisma generate, migrate
npm run db:reset     # Reset SQLite DB
```

## Architecture

- `src/` — React frontend
  - `App.tsx` — layout, panels, project state
  - `contexts/` — Auth + FileSystem
  - `components/` — chat, editor, preview, auth, gallery
- `server/` — Express
  - `index.ts` — entry point
  - `auth.ts` — JWT helpers
  - `prisma.ts` — DB client
  - `provider.ts` — AI model selection
  - `tools.ts` — AI file-operation tools
  - `routes/` — auth, chat, project routes
- `prisma/` — schema
- `generated/` — saved UI output

## Rules

- TypeScript strict, ES modules.
- Use `@/` for `src/` imports; `@server/` for `server/` imports.
- Use Tailwind utilities; avoid custom CSS.
- Function components + hooks for state.
- Use `zod` for runtime validation of AI-generated data.
- API routes under `/api`; use `credentials: "include"` on authenticated `fetch`.
- Return `{ success, error }` JSON from server operations.
- Run `npx prisma generate` after schema changes.
- Never hardcode credentials or API keys.

## Manual Verification Checklist

- Sign-up / sign-in
- Chat generates a component
- Preview, code editor, and file save work
- Project load/save persists
