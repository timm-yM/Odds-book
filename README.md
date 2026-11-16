# ODDSBOOK

A marketplace for sports picks — buyers browse and unlock odds/analysis listed by
independent sellers (free or priced per pick); a master **admin** account posts
official ODDSBOOK picks the same way, badged separately.

Rebuilt from the original Lovable/Supabase starter into a standard, modular
stack you can run and deploy anywhere:

```
oddsbook/
├── backend/     Node + Express + TypeScript + MongoDB (Mongoose) REST API
├── frontend/    React + TypeScript + Vite + Tailwind CSS SPA
└── render.yaml  Render blueprint for deploying the API
```

## Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Axios |
| Backend   | Node.js, Express, TypeScript, Mongoose (MongoDB), JWT auth, Zod validation, Pay Hero M-Pesa STK Push (optional) |
| Database  | MongoDB (local or Atlas) |
| Deploy    | Frontend → Vercel · Backend → Render |

## How the marketplace works

- Any signed-in user can list a pick (`POST /api/picks`) — that's the "sell" side.
- A pick's `selection` and `analysis` fields are hidden (`locked: true`) until the
  viewer is the seller, an admin, or has a **completed** order for it. Free
  picks (`price: 0`) are never locked.
- Buying calls `POST /api/orders/checkout`:
  - **Free pick** → instantly completed, no payment.
  - **Paid pick, Pay Hero configured** → sends an M-Pesa STK Push to the buyer's phone;
    the order unlocks when Pay Hero confirms payment.
  - **Paid pick, no Pay Hero keys set** → completes instantly ("demo mode") so
    you can test the full buy flow before wiring up real payments.
- The user whose email/password match `ADMIN_EMAIL`/`ADMIN_PASSWORD` (seeded via
  `npm run seed:admin`) has `role: "admin"`. Their picks are automatically
  flagged `isOfficial: true` and badged "Official" in the UI. Admins can also
  delete any listing (moderation).

## Local setup

### 1. Backend

```bash
cd backend
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, etc.
npm install
npm run dev                # http://localhost:5000
```

Create your master admin account (reads ADMIN_EMAIL / ADMIN_PASSWORD from `.env`):

```bash
npm run seed:admin
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

Log in with the admin credentials you seeded to see the **Admin Panel** link in
the header dropdown.

## Environment variables

**backend/.env**

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Long random string used to sign auth tokens |
| `CLIENT_URL` | Frontend origin — used for CORS |
| `API_URL` | Public URL of the API (Pay Hero posts callbacks here) |
| `PAYHERO_API_USERNAME` / `PAYHERO_API_PASSWORD` / `PAYHERO_CHANNEL_ID` / `PAYHERO_CALLBACK_SECRET` | Optional — leave blank to run paid checkout in demo/instant-unlock mode |
| `PLATFORM_FEE_PERCENT` | % ODDSBOOK keeps from each paid sale |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Used only by `npm run seed:admin` |

**frontend/.env**

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, including `/api` |

See `DEPLOYMENT.md` for the production deployment flow and git commands.
