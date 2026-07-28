# Cuts by Scrap

Website, booking system, and admin dashboard for Cuts by Scrap — a college student barber. Built with Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, and Prisma + Postgres (Netlify DB).

**Live demo:** https://cuts-by-scrap.netlify.app · admin login at `/admin/login` — see `.env` / your Netlify env vars for credentials.

## Getting Started

The deployed site on Netlify needs zero setup — `@netlify/database` auto-provisions Postgres and `netlify/database/migrations/` auto-applies the schema + seed data on every deploy.

For local development you need a Postgres connection (there's no more local SQLite file):

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET, etc.
npx prisma generate
psql "$DATABASE_URL" -f netlify/database/migrations/20260728010000_init/migration.sql   # creates schema + seed data
npm run dev
```

Easiest way to get a `DATABASE_URL` locally: install the Netlify CLI, run `netlify link` to connect this repo to the `cuts-by-scrap` site, then `netlify dev` — it provisions an isolated dev database branch automatically and injects the connection string for you (skip the `psql` step above in that case; Netlify applies the migration for you).

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login` for the admin dashboard (username/password come from `ADMIN_USERNAME` / `ADMIN_PASSWORD` in `.env` at seed time).

**Change the admin password before this ever goes live** — the default in `.env.example` is a placeholder.

## Environment Variables

See `.env.example` for the full list with explanations. The important ones:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Local dev only | Postgres connection string. Unset on Netlify — provided automatically by `@netlify/database` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Yes | Seeded admin login |
| `SESSION_SECRET` | Yes | Signs admin login session cookies |
| `CRON_SECRET` | Yes (for reminders) | Protects the 24h-reminder endpoint |
| `SMTP_*` / `ADMIN_NOTIFICATION_EMAIL` | Optional | Email notifications — no-ops (logs to console) if unset |
| `TWILIO_*` | Optional, future | SMS notifications — see below |
| `NEXT_PUBLIC_SITE_URL` | Yes | Used for metadata, sitemap, and JSON-LD |

## Email Notifications (SMTP)

`src/lib/notifications.ts` sends email via any SMTP server using `nodemailer`. If `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` aren't set, it just logs what it would have sent to the console — useful for local development.

Easiest real option for a small barbershop: a **Gmail App Password**.

1. Turn on 2-Step Verification on the Gmail account.
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) and create an app password for "Mail".
3. Set in `.env`:
   ```
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="yourbarbershop@gmail.com"
   SMTP_PASS="the-16-character-app-password"
   SMTP_FROM="Cuts by Scrap <yourbarbershop@gmail.com>"
   ADMIN_NOTIFICATION_EMAIL="yourbarbershop@gmail.com"
   ```

Any other SMTP provider (Resend, SendGrid, etc.) works the same way — just point `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS` at their relay.

## Adding SMS Later (Twilio)

Notifications are already split into channels in `src/lib/notifications.ts`. To turn on SMS:

1. `npm install twilio`
2. Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` in `.env`.
3. Fill in the body of `sendSms()` in `src/lib/notifications.ts` (the Twilio call is already sketched out in a comment there).

No other code changes needed — every booking event already calls through `notify()`, which will pick up the new SMS channel automatically.

## 24-Hour Appointment Reminders

`/api/cron/reminders` finds tomorrow's confirmed appointments and sends reminders. It requires an external scheduler to call it — Next.js has no built-in cron.

- **On Vercel**: `vercel.json` already has a cron entry that hits it hourly (only takes effect if this project is ever hosted there instead of Netlify).
- **On Netlify** (current host): add a small [Netlify Scheduled Function](https://docs.netlify.com/build/functions/scheduled-functions/) that `fetch()`es this route with the bearer token, or use any external scheduler.
- **Elsewhere**: any scheduler (GitHub Actions cron, an OS crontab, etc.) can call it the same way:
  ```bash
  curl -H "Authorization: Bearer $CRON_SECRET" https://yourdomain.com/api/cron/reminders
  ```

## Database: Postgres via Netlify DB

Data lives in Postgres, provisioned automatically by `@netlify/database` — no manual database setup, no connection string to manage in production. `src/lib/prisma.ts` builds the Prisma client with `@prisma/adapter-pg`, using `getConnectionString()` (falling back to a local `DATABASE_URL` if set, for local dev against your own Postgres).

Schema + seed data live as plain SQL in `netlify/database/migrations/20260728010000_init/migration.sql` (Netlify's own migration mechanism — applied automatically before each deploy is published) rather than through `prisma migrate`, since the database doesn't exist yet until Netlify provisions it during the build. If you change `prisma/schema.prisma`, add a new numbered folder under `netlify/database/migrations/` with the matching `ALTER TABLE`/etc. SQL.

## Project Structure

```
prisma/               Schema, migrations, seed script
src/
  proxy.ts             Auth guard for /admin and /api/admin (Next 16's middleware replacement)
  lib/                 Prisma client, auth, availability engine, notifications, csv, seo, validation
  components/
    ui/                Design-system primitives (Button, GlassCard, Modal, etc.)
    layout/            Navbar, Footer
    home/, services/, portfolio/, booking/, reviews/, contact/   Public site sections
    admin/             Admin dashboard components
  app/
    (site)/            Public marketing pages (shares Navbar/Footer layout)
    admin/             Login (no shell) + (dashboard) route group (sidebar shell)
    api/                Booking, admin CRUD, and cron route handlers
```

## Admin Dashboard

Log in at `/admin/login`. From there you can manage:

- **Appointments** — day/week/month/list views, status changes, rescheding, CSV export
- **Services** — pricing, duration, description, visibility
- **Portfolio** — photo uploads (with optional before/after pairs), category tagging, featured flag
- **Reviews** — add/edit/feature/approve testimonials
- **FAQ** — the questions shown on the Contact page
- **Hours & Availability** — weekly hours, lunch breaks, blocked dates, vacation mode, booking on/off, max appointments/day, default duration
- **Site Content** — hero/about text, contact info, social links, logo upload

## Tech Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · Framer Motion · Prisma 7 (Postgres via `@netlify/database` + `@prisma/adapter-pg`) · react-hook-form + zod · jose (sessions) · bcryptjs · nodemailer
