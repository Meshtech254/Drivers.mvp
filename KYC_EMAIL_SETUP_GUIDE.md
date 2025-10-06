# KYC Email Notification Setup Guide

This guide will help you set up automatic email notifications for KYC uploads, approvals, and rejections using Supabase.

## 📋 Overview

You have **two options** for implementing KYC email notifications:

### Option 1: Database Trigger + Next.js API (Recommended - Simpler)
- Uses PostgreSQL trigger to call your existing Next.js API endpoint
- No need to deploy Edge Functions
- Works with your current setup

### Option 2: Database Trigger + Supabase Edge Function (More Scalable)
- Uses Supabase Edge Functions (serverless)
- 100% Supabase-native
- Better for high-volume applications

---

## 🚀 Option 1: Database Trigger + Next.js API (RECOMMENDED)

### Step 1: Enable HTTP Extension in Supabase

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this command:

```sql
CREATE EXTENSION IF NOT EXISTS http;
```

### Step 2: Apply the Trigger

1. Open the file: `supabase/kyc_email_setup.sql`
2. Copy the entire contents
3. Go to **Supabase Dashboard** → **SQL Editor**
4. Paste and run the SQL

### Step 3: Configure API URL (Production Only)

For production, set your API URL in Supabase:

1. Go to **Project Settings** → **Database** → **Custom Config**
2. Add this setting:
   ```
   app.api_url = https://your-production-domain.com
   ```

For local development, it defaults to `http://localhost:3000`

### Step 4: Verify SMTP Configuration

Make sure your `.env.local` has:

```env
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=noreply@easydriverhire.com
```

### Step 5: Test It!

Update a user's KYC status in Supabase:

```sql
-- Test pending notification
UPDATE profiles 
SET kyc_status = 'pending' 
WHERE email = 'test@example.com';

-- Test approval notification
UPDATE profiles 
SET kyc_status = 'approved' 
WHERE email = 'test@example.com';

-- Test rejection notification
UPDATE profiles 
SET kyc_status = 'rejected' 
WHERE email = 'test@example.com';
```

Check your email inbox for the notifications!

---

## 🌐 Option 2: Supabase Edge Function (Advanced)

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Link Your Project

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### Step 3: Deploy the Edge Function

```bash
cd supabase/functions
supabase functions deploy send-kyc-email
```

### Step 4: Set Environment Variables

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set EMAIL_FROM=noreply@easydriverhire.com
supabase secrets set SITE_URL=https://your-domain.com
```

### Step 5: Enable pg_net Extension

In Supabase SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Step 6: Apply the Trigger

1. Open `supabase/kyc_email_trigger_webhook.sql`
2. Replace `YOUR_PROJECT_REF` with your actual project reference
3. Run the SQL in Supabase SQL Editor

### Step 7: Test the Edge Function

```bash
curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-kyc-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"email":"test@example.com","full_name":"Test User","kyc_status":"approved"}'
```

---

## 📧 Email Templates

The system sends different emails based on KYC status:

### 1. **Pending** (Upload Confirmation)
- **Subject**: "KYC Documents Received - EasyDriverHire"
- **Sent when**: User uploads KYC documents
- **Message**: Confirms receipt and notifies about review process

### 2. **Approved** (Success)
- **Subject**: "KYC Verified Successfully - EasyDriverHire"
- **Sent when**: Admin approves KYC
- **Message**: Congratulates user and provides dashboard link

### 3. **Rejected** (Resubmission Required)
- **Subject**: "KYC Documents Declined - EasyDriverHire"
- **Sent when**: Admin rejects KYC
- **Message**: Explains rejection and provides resubmission link

---

## 🔍 Troubleshooting

### Emails Not Sending

1. **Check RESEND_API_KEY**:
   ```bash
   # In .env.local
   echo $RESEND_API_KEY
   ```

2. **Check Supabase Logs**:
   - Go to **Supabase Dashboard** → **Logs** → **Postgres Logs**
   - Look for warnings or errors related to `send_kyc_email_notification`

3. **Test API Endpoint Directly**:
   ```bash
   curl -X POST http://localhost:3000/api/notifications/send-email \
     -H "Content-Type: application/json" \
     -d '{"to":"test@example.com","subject":"Test","text":"Test message"}'
   ```

### Trigger Not Firing

1. **Verify trigger exists**:
   ```sql
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'trigger_send_kyc_email';
   ```

2. **Check function exists**:
   ```sql
   SELECT * FROM pg_proc 
   WHERE proname = 'send_kyc_email_notification';
   ```

3. **Re-apply the trigger**:
   - Run `supabase/kyc_email_setup.sql` again

### HTTP Extension Issues

If you get "extension http does not exist":

```sql
-- Check available extensions
SELECT * FROM pg_available_extensions WHERE name = 'http';

-- Enable it
CREATE EXTENSION IF NOT EXISTS http;
```

---

## 🎯 How It Works

```
┌─────────────────┐
│  User uploads   │
│  KYC documents  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  kyc_status =   │
│    'pending'    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Database       │
│  Trigger Fires  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Calls Email    │
│  API/Function   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Resend sends   │
│  email to user  │
└─────────────────┘
```

---

## ✅ Verification Checklist

- [ ] HTTP extension enabled in Supabase
- [ ] Trigger function created (`send_kyc_email_notification`)
- [ ] Trigger created (`trigger_send_kyc_email`)
- [ ] RESEND_API_KEY configured
- [ ] EMAIL_FROM configured
- [ ] Tested with pending status
- [ ] Tested with approved status
- [ ] Tested with rejected status
- [ ] Emails received successfully

---

## 📝 Notes

- Emails are sent **asynchronously** - the database update won't fail if email fails
- Email failures are logged as warnings in Supabase logs
- The trigger only fires when `kyc_status` actually changes
- No email is sent if the email field is empty
- You can customize email templates in the trigger function or Edge Function

---

## 🆘 Need Help?

1. Check Supabase Postgres Logs
2. Check your Next.js server logs
3. Verify Resend API key is valid
4. Test email API endpoint independently
5. Check that profiles table has email column populated

---

## 🔄 Removing the Setup

If you need to remove the email notifications:

```sql
-- Drop the trigger
DROP TRIGGER IF EXISTS trigger_send_kyc_email ON profiles;

-- Drop the function
DROP FUNCTION IF EXISTS send_kyc_email_notification();

-- (Optional) Drop the extension
DROP EXTENSION IF EXISTS http;
```
