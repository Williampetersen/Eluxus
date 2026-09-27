# Eluxus

Eluxus is now a Next.js 16 App Router project for the Eluxus booking site, customer portal, and admin dashboard.

## Stack

- Next.js 16
- React 19
- TypeScript
- App Router
- Tailwind CSS 4
- React Hook Form + Zod
- React Day Picker
- Framer Motion
- PostgreSQL via `postgres`
- Nodemailer SMTP

## Main Routes

- `/`
  Marketing homepage with hero video and number-plate lookup
- `/booking`
  Multi-step booking flow with vehicle lookup, package selection, add-ons, appointment selection, and customer form
- `/kunde/[token]`
  Customer portal with booking history, profile update form, and payments placeholder
- `/admin/login`
  Admin login page
- `/admin`
  Admin dashboard with bookings, calendar, customers, and settings views

## API Routes

- `/api/vehicle/[plate]`
  MotorAPI vehicle lookup
- `/api/bookings/create`
  Public booking creation
- `/api/customer/[token]`
  Customer profile updates from the portal
- `/api/admin/login`
  Admin authentication
- `/api/admin/logout`
  Admin logout
- `/api/admin/settings`
  Booking and mail settings update
- `/api/admin/bookings/create`
  Manual admin booking creation
- `/api/admin/bookings/[id]`
  Admin booking status actions and delete

## Environment Variables

Add these in `.env` locally and in Vercel for production:

```bash
MOTORAPI_API_KEY=
DATABASE_URL=
APP_URL=

ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=

BOOKING_ADMIN_EMAIL=

SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM=
MAIL_FROM_NAME=Eluxus
```

### Simply.com SMTP Example

```bash
SMTP_HOST=websmtp.simply.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@eluxus.dk
SMTP_PASSWORD=your-mailbox-password
MAIL_FROM=Eluxus <info@eluxus.dk>
MAIL_FROM_NAME=Eluxus
BOOKING_ADMIN_EMAIL=info@eluxus.dk
```

## Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Start the production server locally:

```bash
npm run start
```

## Database Notes

The schema is created automatically on first use when `DATABASE_URL` is configured.

Tables created by the server layer:

- `customers`
- `bookings`
- `booking_settings`

## Assets

Public assets remain in `public/`, including:

- `public/logo.png`
- `public/opengraph.jpg`
- `public/DKEU.svg`
- `public/videos/frontvideo.mp4`
- `public/bilbrands/*`
- `public/robots.txt`

## Legacy Astro Source

The previous Astro implementation was preserved under:

```text
legacy/astro-src
```

This keeps the original pages, layouts, components, content files, and Astro APIs available for reference during the migration.

## Verification Done

The migration was verified with:

- `npm install`
- `npm run build`
- Local HTTP checks against `/`, `/booking`, and `/admin/login`

