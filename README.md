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
- Ask natural-language questions to an AI-powered portfolio coach (coming soon)

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
| Data API     | Polygon.io or Yahoo Finance (planned)  |
| AI           | OpenAI API for GPT-based insights      |
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
- [ ] User model & authentication - In Progress 6/6
- [ ] Holdings CRUD routes
- [ ] Live stock data integration
- [ ] AI portfolio assistant

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

