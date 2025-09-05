# EasyDriversHire

Production-ready Next.js + Supabase app for hiring drivers with auth, roles, profiles, search/filters, bookings with email notifications, and driver/employer dashboards.

## 1) Prerequisites

- Supabase project with the schema in `supabase/schema.sql` applied
- Storage bucket named `driver-photos` (public or with a read policy)
- Resend account (optional, for emails)
- Vercel account connected to your Git provider

## 2) Environment variables

Create a `.env.local` file for local dev, and set the same in Vercel Project Settings → Environment Variables.

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only; add as Encrypted in Vercel, never expose publicly)

Optional (emails):

- `RESEND_API_KEY`
- `EMAIL_FROM` (e.g., noreply@easydrivershire.com)

See `.env.example` for a template.

## 3) Local development

```bash
npm install
npm run dev
```

## 4) Deploy to Vercel (Step-by-step)

1. Push your code to GitHub/GitLab/Bitbucket.
2. In Vercel Dashboard, click "New Project" and import this repository.
3. Framework Preset: select "Next.js" (auto-detected).
4. Set Environment Variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add `SUPABASE_SERVICE_ROLE_KEY` (Protect as Encrypted)
   - Add `RESEND_API_KEY` (optional)
   - Add `EMAIL_FROM` (optional)
5. Build and Output Settings: keep defaults
   - Build Command: `next build`
   - Output Directory: (auto for Next.js on Vercel)
6. Click Deploy.
7. After first deploy, test:
   - Auth flow: `/auth/auth`
   - Drivers: `/drivers`
   - Driver Dashboard: `/drivers/dashboard`
   - Employer Dashboard: `/employer/dashboard`

## 5) Supabase schema

Run the SQL in `supabase/schema.sql` within the Supabase SQL Editor.

Storage (if public):

```
-- If you want public read access to driver photos
-- In Storage policies for bucket driver-photos, add a policy:
-- (Adjust according to your security needs)
-- SELECT: anyone
-- INSERT/UPDATE/DELETE: only authenticated and only under their own folder (user_id prefix)
```

## 6) Configuration notes

- The app writes minimal profiles on sign-in and lets drivers edit their full profile in `/drivers/dashboard`.
- Booking emails are sent via Resend if `RESEND_API_KEY` is present; otherwise the booking will still be stored.
- Brand name and UI are configured for EasyDriversHire.
