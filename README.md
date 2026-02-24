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

## 🛠️ Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```
4. Run database migrations:
   ```bash
   pnpm dlx prisma migrate deploy
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | Direct PostgreSQL connection (for migrations) |
| `POLYGON_API_KEY` | Polygon.io API key for stock prices |

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

