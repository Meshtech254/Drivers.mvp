# Drivers.com MVP (Booking + Email)

This scaffold includes:
- Next.js frontend (basic pages)
- Supabase client integration
- Booking flow: client books a driver -> saved to Supabase -> sends email to driver via Resend API
- `.env.local.example` with required environment variables

## Quick start
1. Unzip and install dependencies:
   ```bash
   unzip drivers-mvp-email.zip
   cd drivers-mvp-email
   npm install
   ```
2. Create a Supabase project and run `supabase/schema.sql` to create tables.
3. Create a Resend account (or other email provider) and get an API key.
4. Create `.env.local` from `.env.local.example` and fill values:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (required for server API to write/read)
   - RESEND_API_KEY
   - EMAIL_FROM (e.g. noreply@drivers.com)
5. Run locally:
   ```bash
   npm run dev
   ```
6. Visit http://localhost:3000

## Notes
- This is an MVP. For production, secure all keys and validate inputs.
- The email sending uses Resend's API format; you can swap for SendGrid or SMTP.
