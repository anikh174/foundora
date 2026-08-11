# Fundora — Crowdfunding Platform

Fundora is a full-stack crowdfunding platform that connects creators with supporters. Supporters back campaigns using platform credits, creators launch and manage fundraising campaigns, and admins moderate the platform through an approval-driven pipeline.

The project is split into two repositories:

| Repository | Stack | Description |
| --- | --- | --- |
| [`anikh174/foundora`](https://github.com/anikh174/foundora) | Next.js (App Router) | Client — web application |
| [`anikh174/foundora-server`](https://github.com/anikh174/foundora-server) | Node.js + Express + MongoDB | API server |

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Accounts](#demo-accounts)
- [Deployment](#deployment)
- [API Overview](#api-overview)
- [License](#license)

---

## Live Demo

- **Client:** <https://foundora-snowy.vercel.app>
- **API:** <https://foundora-server.vercel.app>

> Both applications are hosted on Vercel. The API exposes a REST interface under `/api`.

---

## Features

### Authentication & Authorization

- Email and password registration and login
- Google Sign-In (Google Identity Services with server-side token verification)
- JWT-based sessions with bcrypt password hashing
- Role-based access control (`supporter`, `creator`, `admin`) enforced on both the API and client routes

### Supporter

- Browse, search, filter, and sort approved campaigns
- Campaign detail pages with live funding progress and deadline
- Contribute credits to campaigns — contributions stay pending until the creator approves
- Purchase credits through Stripe Checkout with instant wallet top-up
- Track contribution status (pending / approved / rejected) and view payment history
- In-app notification center

### Creator

- Create campaigns with cover-image upload (ImgBB)
- Edit and delete campaigns (deletion refunds approved supporters)
- Approve or reject contributions; credits settle into the wallet on approval
- Request withdrawals — 20 credits = $1, minimum 200 credits — via Stripe, bKash, Rocket, or Nagad
- Payment history and in-app notifications

### Admin

- Platform-wide analytics dashboard
- Manage users, change roles, and delete accounts
- Review, approve, or reject pending campaigns with feedback
- Suspend or delete campaigns (with automatic supporter refunds)
- Approve or reject creator withdrawal requests
- Resolve moderation reports on flagged campaigns

### UI / UX

- Fully responsive, modern interface with an emerald brand identity
- Landing page with hero slider, live stats, categories, and how-it-works
- Skeleton loaders, spinners, empty states, and toast notifications
- Pagination across all data tables
- Custom 404, loading, and unauthorized pages

---

## Tech Stack

### Frontend

- **Next.js** (App Router) + **React 19**
- **Tailwind CSS v4** (custom `@theme` design tokens)
- **Axios** — API client with auth/error interceptors
- **Swiper** — hero carousel
- **React Hot Toast** — notifications
- **Lucide Icons**

### Backend

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT + bcryptjs** — authentication
- **Google Auth Library** — Google Sign-In verification
- **Stripe** — Checkout Sessions for credit purchases
- **ImgBB** — image hosting

---

## Project Structure

### Client (`foundora`)

```
src/
├── app/                  # App Router pages & layouts
│   ├── (site)/           # Public pages (home, campaigns, login, register)
│   └── dashboard/        # Role-based dashboards (admin, creator, supporter)
├── components/           # Reusable UI and feature components
├── context/              # Auth context / provider
└── lib/                  # API client, image upload, utilities
```

### Server (`foundora-server`)

```
├── config/               # Database connection
├── controllers/          # Route handlers
├── middleware/           # Auth, role checks, error handling
├── models/               # Mongoose schemas
├── routes/               # Express routers
├── utils/                # Notifications, image upload
├── seed.js               # Demo data seeder
└── index.js              # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or local instance)
- Stripe account (test keys)
- ImgBB API key (for image uploads)
- Google Cloud OAuth 2.0 credentials (for Google Sign-In)

### 1. Run the server

```bash
git clone https://github.com/anikh174/foundora-server.git
cd foundora-server
npm install
npm run seed   # optional: seed demo data
npm run dev
```

The API runs on `http://localhost:5000`.

### 2. Run the client

```bash
git clone https://github.com/anikh174/foundora.git
cd foundora
npm install
npm run dev
```

The client runs on `http://localhost:3000`.

---

## Environment Variables

### Client (`.env`)

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_UPLOAD_API=<imgbb-api-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-client-id>
```

> In production, `NEXT_PUBLIC_BASE_URL` resolves to the deployed API URL (`https://foundora-server.vercel.app`).

### Server (`.env`)

```env
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>
IMGBB_API_KEY=<imgbb-api-key>
GOOGLE_CLIENT_ID=<google-client-id>
```

---

## Demo Accounts

After running `npm run seed`, the following accounts are available:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@fundora.com` | `Admin@123` |
| Creator | `sarah@fundora.com` | `Creator@123` |
| Creator | `david@fundora.com` | `Creator@123` |
| Creator | `amina@fundora.com` | `Creator@123` |
| Creator | `james@fundora.com` | `Creator@123` |
| Creator | `elena@fundora.com` | `Creator@123` |
| Supporter | `priya@fundora.com` | `Supporter@123` |
| Supporter | `michael@fundora.com` | `Supporter@123` |

---

## Deployment

Both applications are designed to run on **Vercel**.

### Client

Import the `foundora` repository into Vercel. Next.js is detected automatically. Add the `NEXT_PUBLIC_*` variables listed above (with `NEXT_PUBLIC_BASE_URL` pointing to the deployed API).

### Server

The server includes a `vercel.json` configured to run the Express app as a serverless function. Add the server environment variables listed above, including:

- `MONGODB_URI` — your MongoDB connection string
- `CLIENT_URL` — the deployed client URL

---

## API Overview

The API exposes the following route groups under `/api`:

| Routes | Description |
| --- | --- |
| `/api/auth` | Register, login, Google Sign-In, current user |
| `/api/campaigns` | Public campaign listing, details, top campaigns, categories, stats |
| `/api/contributions` | Supporter contributions and creator approval flows |
| `/api/payments` | Stripe Checkout sessions and payment verification |
| `/api/withdrawals` | Creator withdrawal requests |
| `/api/notifications` | In-app notifications |
| `/api/admin` | Admin analytics, moderation, and management |

All protected routes require a `Bearer` token. Role-specific routes enforce the appropriate role server-side.

---

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).
