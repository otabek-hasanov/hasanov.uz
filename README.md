# Hasanov.uz

Personal portfolio for Otabek Hasanov — a React single-page application backed by a Node.js/Express JSON API, MySQL, and Redis.

**Live:** https://hasanov.uz

## Stack

- **Frontend:** React 18 + React Router (client-side SPA), Vite, Tailwind CSS, Three.js (animated hologram hero)
- **Backend:** Node.js, Express, MySQL (`mysql2`), Redis (sessions + cache via `ioredis`/`connect-redis`)
- **i18n:** Uzbek / Russian / English, locale-prefixed routes (`/uz`, `/ru`, `/en`)

## Architecture

The Express backend is a pure JSON API under `/api/*` (public endpoints for profile/skills/projects/etc., plus session-authenticated `/api/admin/*` endpoints for the admin panel). The React app (`frontend/`) consumes this API and owns all routing and rendering client-side. The same Express process also serves the built SPA (`/spa`) as static files with an HTML fallback for client-side routes, and serves `/robots.txt`, `/sitemap.xml`, `/manifest.json`.

```
backend/src/routes/           Public + admin API routes
backend/src/services/         PortfolioService (cached reads), ContactService, AuthService
backend/src/middleware/       Auth, CSRF, file upload (multer)
backend/src/server.js         Express app entry point (API + static SPA + SEO routes)
database/                     SQL migration + seed/maintenance scripts
frontend/                     React app source (Vite)
spa/                           Built SPA output (generated, gitignored)
public_assets/                 Uploaded images, resume, static images
```

## Local development

**Backend:**
```bash
cd backend
npm install
npm run migrate                         # applies database/migrations/*.sql
npm run seed <admin-username> <admin-password>
npm start                                # Express on :3000 (http://127.0.0.1:3000)
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev   # Vite dev server, proxies /api to 127.0.0.1:3000
```

**Production build:**
```bash
cd frontend && npm run build   # outputs to ../spa
```

Copy `.env.example` to `.env` (at the project root) and fill in your MySQL/Redis credentials before running the backend.
