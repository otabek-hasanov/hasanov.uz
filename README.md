# Hasanov.uz

Personal portfolio for Otabek Hasanov — a React single-page application backed by a custom PHP 8.5 JSON API, MySQL, and Redis.

**Live:** https://hasanov.uz

## Stack

- **Frontend:** React 18 + React Router (client-side SPA), Vite, Tailwind CSS, Three.js (animated hologram hero)
- **Backend:** PHP 8.5, a small Laravel-flavored framework (`app/Core`) built on [bramus/router](https://github.com/bramus/router), MySQL, Redis (sessions + cache)
- **i18n:** Uzbek / Russian / English, locale-prefixed routes (`/uz`, `/ru`, `/en`)

## Architecture

The PHP backend is a pure JSON API under `/api/*` (public endpoints for profile/skills/projects/etc., plus session-authenticated `/api/admin/*` endpoints for the admin panel). The React app (`frontend/`) consumes this API and owns all routing and rendering client-side. `.htaccess` routes `/api/*` and a few SEO endpoints (`/robots.txt`, `/sitemap.xml`, `/manifest.json`) to the PHP front controller, and serves the built SPA shell (`/spa/index.html`) for everything else.

```
app/Core/            Request/Response/Router/Database/Auth/Redis cache — the mini-framework
app/Http/Controllers/Api/   JSON API controllers (public + admin)
app/Services/         PortfolioService (cached reads), ContactService
routes/web.php         SEO routes (robots.txt, sitemap.xml, manifest.json)
routes/api.php         All API routes
database/              SQL migration + seed/maintenance scripts
frontend/               React app source (Vite)
spa/                     Built SPA output (generated, gitignored)
public_assets/           Uploaded images, resume, static images
```

## Local development

**Backend:**
```bash
composer install
php database/migrate.php
php database/seed.php <admin-username> <admin-password>
php -S 127.0.0.1:8099   # serves index.php as the API backend
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev   # Vite dev server, proxies /api to 127.0.0.1:8099
```

**Production build:**
```bash
cd frontend && npm run build   # outputs to ../spa
```

Copy `.env.example` to `.env` and fill in your MySQL/Redis credentials before running the backend.
