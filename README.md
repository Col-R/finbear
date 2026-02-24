# 🐻 Finbear

**Finbear** is a modern, fullstack investment dashboard built with the best tools and a clear purpose:

> To make portfolio tracking insightful, secure, and genuinely fun — plus its a good way for the developer, Cole, to show off a bit.

---

## ✨ Vision

Finbear empowers users to:
- Securely log in to their own account
- Add holdings with ticker, cost basis, and share count
- Pull real-time stock prices and historical data
- View total portfolio value and gain/loss over time


Finbear isn't just another finance app — it's a demonstration of how **modern fullstack architecture** can meet **clear product goals** and stay delightful along the way.

---

## 🧠 Tech Stack

| Layer        | Tech                                   |
|--------------|----------------------------------------|
| Frontend     | Next.js 15 (App Router) + React 19     |
| Styling      | Tailwind CSS 4 + ShadCN UI             |
| Backend      | Next.js API Routes                     |
| Auth         | Supabase Auth (JWT-based)              |
| ORM/DB       | Prisma + PostgreSQL                    |
| Data API     | Polygon.io (live stock prices)         |
| AI           | Planned for future release             |
| Deployment   | Vercel (frontend + backend)            |

---

## 📁 Project Structure

```
/src
  /app            → App Router pages & API routes
  /components     → ShadCN + app components
  /lib            → Utility functions (auth, Prisma, etc)
  /styles         → Global Tailwind config
/prisma
  schema.prisma   → DB models (User, Holding)
.env, .env.local  → Secrets
```

---

## 🚧 Current Status

Finbear is actively being developed. Upcoming milestones:
- [x] Project scaffolded (Next.js 15 + Tailwind 4 + Prisma 6)
- [x] ShadCN components set up
- [x] User authentication (Supabase Auth with login/signup)
- [x] Portfolio CRUD (create, rename, delete)
- [x] Position CRUD (add, edit, delete)
- [x] Live stock prices (Polygon.io integration)
- [x] Gain/Loss calculations (per-position and portfolio-level)
- [x] Toast notifications (Sonner)
- [x] Marketing landing page
- [ ] AI portfolio assistant (future)

---

## 🛠️ Local Development Guide

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | 20+ | Tested on v25. Node 22+ requires the `instrumentation.ts` fix (included). |
| **pnpm** | 9+ | Package manager — `npm install -g pnpm` if needed |
| **Git** | 2.x | Standard Git |

You will also need accounts (free tiers work) for:
- [Supabase](https://supabase.com) — Auth + PostgreSQL database
- [Polygon.io](https://polygon.io) — Stock market data API

### 1. Clone & Install

```bash
git clone https://github.com/your-username/finbear.git
cd finbear
pnpm install
```

`pnpm install` automatically runs `prisma generate` via the `postinstall` script.

### 2. Set Up Supabase

1. Create a new project at [app.supabase.com](https://app.supabase.com)
2. Go to **Project Settings > API** and note:
   - **Project URL** (`https://<ref>.supabase.co`)
   - **Anon public key** (`eyJ...`)
3. Go to **Project Settings > Database** and note:
   - **Connection string (Transaction mode)** — this is your `DATABASE_URL`
   - **Connection string (Session mode)** — this is your `DIRECT_URL`

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
DATABASE_URL=postgresql://postgres.<ref>:<password>@<pooler-host>:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.<ref>:<password>@<pooler-host>:5432/postgres
POLYGON_API_KEY=<your-polygon-api-key>
```

Also create a `.env` file with just the database URLs (Prisma reads this):

```bash
DATABASE_URL="<same as above>"
DIRECT_URL="<same as above>"
```

> **Important**: Copy the exact pooler hostname from your Supabase dashboard. It varies per project (e.g., `aws-0-us-east-1.pooler.supabase.com` vs `aws-1-us-east-1.pooler.supabase.com`). Using the wrong prefix will cause a `FATAL: Tenant or user not found` error.

### 4. Run Database Migrations

```bash
pnpm dlx prisma migrate deploy
```

This creates the `User`, `Portfolio`, and `Position` tables in your Supabase PostgreSQL database.

> **Note**: If your Supabase database only resolves over IPv6 and your machine doesn't support it, you can apply migrations via the [Supabase Management API](https://supabase.com/docs/reference/api/introduction) or use the pooler session-mode URL (`DIRECT_URL` on port 5432) as a workaround.

### 5. Start the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app runs on port 3000 by default (or the next available port).

### 6. Verify It Works

1. Navigate to `/signup` and create an account
2. You should be redirected to `/dashboard`
3. Create a portfolio, add positions with stock tickers
4. Live prices will load from Polygon.io

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm lint` | Run ESLint |

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (`https://<ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `DATABASE_URL` | Yes | PostgreSQL connection via Supabase pooler (port 6543, transaction mode) |
| `DIRECT_URL` | Yes | PostgreSQL direct/session connection (port 5432, for migrations) |
| `POLYGON_API_KEY` | Yes | Polygon.io API key for live stock prices |

### Troubleshooting

**`FATAL: Tenant or user not found`**
Your `DATABASE_URL` pooler hostname doesn't match your Supabase project. Copy the exact connection string from your Supabase dashboard under **Project Settings > Database > Connection string**.

**`TypeError: localStorage.getItem is not a function`**
This happens on Node.js 22+ where a broken `localStorage` global is exposed. The fix is already included in `src/instrumentation.ts` — make sure you haven't deleted that file.

**`pnpm dlx prisma migrate deploy` fails with connection timeout**
Your Supabase direct database host may be IPv6-only. Use the pooler session-mode URL (port 5432) as your `DIRECT_URL`, or apply migrations through the Supabase dashboard SQL editor.

**Port already in use**
If port 3000 is taken, Next.js will auto-increment. Check your terminal output for the actual port.

---

## 💼 Why It Exists

This project is part of a strategic dev portfolio. It demonstrates:
- Fullstack web skills on a modern stack
- Secure and scalable architecture
- A thoughtful balance of performance, design, and DX
- The ability to build productively with AI, not be replaced by it

---

## 🙌 Stay Tuned

This repo will evolve fast. Want to follow along or contribute?  
Drop a ⭐️, fork it, or just check back for major updates.

Finbear is here to make finance *bearable*

