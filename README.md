# Fundora - Modern Crowdfunding Platform

Fundora is a full-stack crowdfunding platform that lets anyone turn ideas into impact. Supporters back campaigns with platform credits, creators launch and manage fundraising campaigns, and admins keep the community safe through a review-driven moderation pipeline.

The project is built with a **Next.js (App Router) client** and a **Node.js + Express + MongoDB API server**, with three role-based dashboards — **Supporter**, **Creator**, and **Admin**.

---

## Live URL

- **Live Site:** https://fundora.vercel.app
- **API Base URL:** https://fundora-api.onrender.com

---

## Admin Credentials

**Email:** `admin@fundora.com`

**Password:** `Admin@123`

> Other seeded accounts (run `npm run seed` in `server/` to create them):
>
> - Creators: `sarah@fundora.com`, `david@fundora.com`, `amina@fundora.com`, `james@fundora.com`, `elena@fundora.com` — password `Creator@123`
> - Supporters: `priya@fundora.com`, `michael@fundora.com` — password `Supporter@123`

---

## Key Features

### Authentication & Authorization

- Email & password registration and login
- Google Sign-In (Google Identity Services + token verification)
- JWT-protected APIs with bearer tokens
- Role-based access control across all routes
- Client-side route guards with role-aware redirects

### Supporter Features

- Browse, search, filter and sort approved campaigns
- Campaign detail pages with live progress, deadline countdown and rewards
- Contribute using platform credits (credits held until creator approval)
- Purchase credits via Stripe checkout with instant wallet top-up
- Track contribution status (pending / approved / rejected with refunds)
- Full payment history and credit balance management
- In-app notification center

### Creator Features

- Create campaigns with image upload via ImgBB
- Edit and delete campaigns (deletion refunds approved supporters)
- Approve or reject contributions — credits settle into the wallet on approval
- Withdraw earnings (20 credits = $1, minimum 200 credits) via Stripe, bKash, Rocket or Nagad
- Payment history of every approved contribution
- In-app notification center

### Admin Features

- Platform-wide analytics dashboard
- Manage users, change roles, delete accounts
- Review and approve / reject pending campaigns with feedback to creators
- Suspend or delete campaigns (with automatic supporter refunds)
- Approve / reject creator withdrawal requests
- Resolve moderation reports on flagged campaigns
- In-app notification center

### UI & UX

- Fully responsive, modern premium design with emerald brand identity
- Landing page with hero slider, live stats, categories and how-it-works
- Skeletons, spinners, empty states and toast notifications
- Pagination across all data tables
- Custom 404, loading and unauthorized pages

---

## Tech Stack

### Frontend

- Next.js (App Router) + React
- Tailwind CSS v4 (custom `@theme` design tokens)
- Axios (interceptor-based API client)
- React Hot Toast
- Lucide Icons
- Swiper (hero carousel)
- Framer Motion

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Google Auth Library
- Stripe (Checkout Sessions)
- ImgBB (image hosting)
- CORS + Dotenv

---

## Installation

### 1. Client

```bash
cd client
npm install
npm run dev
```

Create a `.env` file with:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_UPLOAD_API=<imgbb-api-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-client-id>
```

### 2. Server

```bash
cd server
npm install
npm run seed   # seeds demo admin, creators, supporters and campaigns
npm run dev
```

Create a `.env` file with:

```env
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>
IMGBB_API_KEY=<imgbb-api-key>
GOOGLE_CLIENT_ID=<google-client-id>
```

The client runs on `http://localhost:3000` and the API on `http://localhost:5000`.

---

## Core Functionalities

- Role-based authentication and authorization
- Google login
- Campaign creation with moderation workflow
- Credit wallet with Stripe-funded top-ups
- Contribution settlement (approve / reject / refund)
- Credit-to-cash withdrawals (20 credits = $1)
- Admin moderation (campaigns, withdrawals, reports, users)
- Search, filter, sort and pagination
- Real-time-style in-app notifications
- Fully responsive design

---

## Security

- JWT-protected APIs
- Bcrypt password hashing
- Server-side role verification middleware
- Environment variables for all secrets
- Protected client routes with role guards
- Ownership checks on campaign and contribution operations
