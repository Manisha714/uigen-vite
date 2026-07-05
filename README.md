# UIGen (Vite + React + Express)

AI-powered React component generator with live preview. Built with Vite, React, Express, and the Vercel AI SDK.

## Tech Stack

- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS
- **Backend**: Express.js
- **Database**: Prisma + SQLite
- **AI**: Vercel AI SDK with AWS Bedrock / Anthropic Claude / Mock provider
- **Editor**: Monaco Editor
- **Preview**: Babel standalone (in-browser JSX transpilation)

## Setup

```bash
# Install dependencies
npm install

# Generate Prisma client and create database
npx prisma generate
npx prisma migrate dev --name init

# Start dev servers (Express + Vite concurrently)
npm run dev
```

## Environment Variables

Copy `.env` and configure your AI provider:

### Option A: AWS Bedrock (pay-per-use)
```
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Option B: Direct Anthropic API
```
ANTHROPIC_API_KEY=your-api-key
```

### No credentials?
The app will use a **mock provider** with canned responses — good for testing the UI.

## Project Structure

```
uigen-vite/
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── auth.ts          # JWT authentication
│   ├── prisma.ts        # Database client
│   ├── provider.ts      # AI model selection (Bedrock/Anthropic/Mock)
│   ├── file-system.ts   # VirtualFileSystem class
│   ├── tools.ts         # AI tool definitions
│   └── routes/
│       ├── auth-routes.ts
│       ├── chat-routes.ts
│       └── project-routes.ts
├── src/                 # React frontend
│   ├── App.tsx          # Main layout with resizable panels
│   ├── main.tsx         # Vite entry point
│   ├── contexts/        # Auth + FileSystem React contexts
│   └── components/
│       ├── chat/        # Chat interface
│       ├── editor/      # Code editor + file tree
│       ├── preview/     # Live preview iframe
│       └── auth/        # Sign in/up dialog
├── prisma/              # Database schema
├── vite.config.ts       # Vite config with API proxy
└── package.json
```

## How It Works

1. **Vite** serves the React frontend on `http://localhost:5173`
2. **Express** runs the API server on `http://localhost:3001`
3. Vite proxies `/api/*` requests to Express
4. User sends a chat message → Express calls Claude → Claude streams back text + tool calls
5. Tool calls create/edit files in the VirtualFileSystem
6. Preview iframe renders the generated React components live using Babel
