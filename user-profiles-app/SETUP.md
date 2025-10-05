# Setup Instructions

## 1. Install Dependencies

```bash
npm install
npm install --save-dev @types/react @types/react-dom @types/react-router-dom
```

## 2. Configure Supabase

### Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be ready

### Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL to create the `drivers` table

### Get Your Credentials
1. Go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy your **anon/public key**

## 3. Create Environment File

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Never commit `.env` to git. It's already in `.gitignore`.

## 4. Run the Application

```bash
npm start
```

The app should open at `http://localhost:3000`

## 5. Deploy to Vercel

### First Time Setup
1. Push your code to GitHub (make sure `.env` is NOT pushed)
2. Go to [https://vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel:
   - Go to **Settings** → **Environment Variables**
   - Add `REACT_APP_SUPABASE_URL`
   - Add `REACT_APP_SUPABASE_ANON_KEY`
5. Deploy!

### Subsequent Deployments
Just push to your main branch - Vercel will auto-deploy.

## Troubleshooting

### "Missing Supabase credentials" error
- Make sure `.env` file exists and has correct values
- Restart your development server after creating/editing `.env`

### "Error fetching drivers" 
- Check that the `drivers` table exists in Supabase
- Verify RLS policies allow reading (see `supabase-schema.sql`)
- Check browser console for detailed error messages

### No drivers showing
- Make sure you have data in the `drivers` table
- Run the sample INSERT statements from `supabase-schema.sql`
- Or add drivers manually in Supabase Table Editor

### TypeScript errors
- Run: `npm install --save-dev @types/react @types/react-dom @types/react-router-dom`
- Delete `node_modules` and run `npm install` again

## Database Schema

The `drivers` table includes:
- `id` - Unique identifier (UUID)
- `name` - Driver's full name
- `email` - Driver's email (unique)
- `phone` - Contact number
- `avatar` - Profile picture URL
- `license_number` - Driver's license number
- `license_type` - Type of license (Class A, B, etc.)
- `experience_years` - Years of driving experience
- `rating` - Driver rating (0-5)
- `status` - Current status (available, busy, offline)
- `location` - Current location
- `created_at` - Timestamp when record was created
- `updated_at` - Timestamp when record was last updated
