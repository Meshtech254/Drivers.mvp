# 🚀 KYC Email Notifications - Setup Checklist

Follow these steps to enable automatic email notifications for KYC status changes.

---

## ⏱️ Estimated Time: 5-10 minutes

---

## Step 1: Get Resend API Key (2 minutes)

- [ ] Go to https://resend.com
- [ ] Sign up or log in
- [ ] Navigate to **API Keys** section
- [ ] Click **Create API Key**
- [ ] Copy the API key (starts with `re_`)

---

## Step 2: Configure Environment Variables (1 minute)

- [ ] Open `.env.local` in your project root
- [ ] Add or update these variables:

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@easydriverhire.com
```

- [ ] Save the file
- [ ] Restart your Next.js development server

```bash
# Stop the server (Ctrl+C) then restart
npm run dev
```

---

## Step 3: Enable HTTP Extension in Supabase (1 minute)

- [ ] Go to **Supabase Dashboard**
- [ ] Navigate to **SQL Editor**
- [ ] Run this command:

```sql
CREATE EXTENSION IF NOT EXISTS http;
```

- [ ] Click **Run** (or press Ctrl+Enter)
- [ ] Verify success message appears

---

## Step 4: Install Database Trigger (2 minutes)

- [ ] Open the file: `supabase/QUICK_SETUP.sql`
- [ ] Copy the **entire contents** of the file
- [ ] Go to **Supabase Dashboard** → **SQL Editor**
- [ ] Paste the SQL code
- [ ] Click **Run** (or press Ctrl+Enter)
- [ ] Verify you see: "✅ SETUP COMPLETE!" message

---

## Step 5: Test the Setup (3 minutes)

### Option A: Quick Test (Recommended)

- [ ] Open **Supabase Dashboard** → **SQL Editor**
- [ ] Run this query (replace with your email):

```sql
-- Create test profile
INSERT INTO profiles (id, email, full_name, is_driver, kyc_status)
VALUES (
  gen_random_uuid(),
  'your-email@example.com',  -- ⚠️ USE YOUR REAL EMAIL
  'Test User',
  true,
  NULL
);

-- Trigger pending email
UPDATE profiles 
SET kyc_status = 'pending' 
WHERE email = 'your-email@example.com';
```

- [ ] Check your email inbox (wait 10-30 seconds)
- [ ] Verify you received: **"KYC Documents Received - EasyDriverHire"**

### Option B: Full Test Suite

- [ ] Open `supabase/TEST_KYC_EMAILS.sql`
- [ ] Follow the instructions in the file
- [ ] Test all three email types (pending, approved, rejected)

---

## Step 6: Verify Installation (1 minute)

- [ ] Run this verification query in Supabase SQL Editor:

```sql
-- Check trigger exists
SELECT 
  trigger_name,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'trigger_send_kyc_email';
```

- [ ] Verify one row is returned with trigger details

---

## ✅ Success Criteria

You should have:

- [x] Resend API key obtained
- [x] Environment variables configured
- [x] HTTP extension enabled in Supabase
- [x] Database trigger installed
- [x] Test email received successfully
- [x] Trigger verified in database

---

## 🎉 You're Done!

Your KYC email notification system is now **live and automatic**!

### What Happens Now:

1. **User uploads KYC documents** → Receives confirmation email
2. **Admin approves KYC** → User receives success email
3. **Admin rejects KYC** → User receives rejection email

All emails are sent **automatically** with no manual intervention needed!

---

## 📚 Additional Resources

- **Detailed Guide**: `KYC_EMAIL_SETUP_GUIDE.md`
- **Implementation Summary**: `KYC_EMAIL_IMPLEMENTATION_SUMMARY.md`
- **Test Script**: `supabase/TEST_KYC_EMAILS.sql`
- **Quick Setup SQL**: `supabase/QUICK_SETUP.sql`

---

## 🐛 Troubleshooting

### Email Not Received?

1. **Check spam folder**
2. **Verify RESEND_API_KEY** in `.env.local`
3. **Restart Next.js server** after adding env vars
4. **Check Supabase Logs**: Dashboard → Logs → Postgres Logs
5. **Test API endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/notifications/send-email \
     -H "Content-Type: application/json" \
     -d '{"to":"test@example.com","subject":"Test","text":"Test"}'
   ```

### Trigger Not Working?

1. **Re-run** `supabase/QUICK_SETUP.sql`
2. **Verify HTTP extension**: `SELECT * FROM pg_extension WHERE extname = 'http';`
3. **Check trigger exists**: See Step 6 verification query above

---

## 🔄 For Production Deployment

When deploying to production:

- [ ] Set production API URL in Supabase:
  - Go to **Project Settings** → **Database** → **Custom Config**
  - Add: `app.api_url = https://your-production-domain.com`

- [ ] Verify environment variables are set on your hosting platform

- [ ] Configure email domain in Resend for better deliverability

- [ ] Test emails in production environment

---

## 📞 Need Help?

Refer to `KYC_EMAIL_SETUP_GUIDE.md` for comprehensive troubleshooting and advanced configuration options.

---

**Setup Date**: _____________  
**Tested By**: _____________  
**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete
