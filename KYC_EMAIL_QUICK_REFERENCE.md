# KYC Email Notifications - Quick Reference Card

## 🚀 5-Minute Setup

```bash
# 1. Get Resend API key from https://resend.com

# 2. Add to .env.local
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=noreply@easydriverhire.com

# 3. In Supabase SQL Editor, run:
CREATE EXTENSION IF NOT EXISTS http;

# 4. Copy/paste supabase/QUICK_SETUP.sql into SQL Editor and run

# 5. Test it:
UPDATE profiles SET kyc_status = 'pending' WHERE email = 'your@email.com';
```

---

## 📧 Email Triggers

| Status | Email Subject | When Sent |
|--------|---------------|-----------|
| `pending` | KYC Documents Received | User uploads KYC docs |
| `approved` | KYC Verified Successfully | Admin approves KYC |
| `rejected` | KYC Documents Declined | Admin rejects KYC |

---

## 🔧 Key Files

| File | Purpose |
|------|---------|
| `supabase/QUICK_SETUP.sql` | One-click installation |
| `supabase/TEST_KYC_EMAILS.sql` | Test script |
| `KYC_EMAIL_SETUP_GUIDE.md` | Full documentation |
| `SETUP_CHECKLIST.md` | Step-by-step checklist |

---

## 🧪 Quick Test

```sql
-- In Supabase SQL Editor
UPDATE profiles 
SET kyc_status = 'approved' 
WHERE email = 'your-test@email.com';
```

Check your inbox in 10-30 seconds!

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No email received | Check spam, verify RESEND_API_KEY, restart server |
| "extension http does not exist" | Run: `CREATE EXTENSION IF NOT EXISTS http;` |
| Trigger not firing | Re-run `QUICK_SETUP.sql` |
| API key error | Check `.env.local` and restart Next.js |

---

## 📊 Verify Installation

```sql
-- Check trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'trigger_send_kyc_email';

-- Check function exists
SELECT * FROM pg_proc 
WHERE proname = 'send_kyc_email_notification';

-- Check HTTP extension
SELECT * FROM pg_extension WHERE extname = 'http';
```

---

## 🔄 Update Email Templates

Edit the CASE statement in `QUICK_SETUP.sql`:

```sql
CASE NEW.kyc_status
  WHEN 'pending' THEN
    email_subject := 'Your Custom Subject';
    email_body := 'Your custom message';
```

Then re-run the SQL to update.

---

## 🗑️ Uninstall

```sql
DROP TRIGGER IF EXISTS trigger_send_kyc_email ON profiles;
DROP FUNCTION IF EXISTS send_kyc_email_notification();
DROP EXTENSION IF EXISTS http;
```

---

## 📞 Support

- **Full Guide**: `KYC_EMAIL_SETUP_GUIDE.md`
- **Supabase Logs**: Dashboard → Logs → Postgres Logs
- **Test API**: `curl -X POST http://localhost:3000/api/notifications/send-email -H "Content-Type: application/json" -d '{"to":"test@example.com","subject":"Test","text":"Test"}'`

---

## ✅ Success Checklist

- [ ] Resend API key configured
- [ ] HTTP extension enabled
- [ ] Trigger installed
- [ ] Test email received
- [ ] Production URL configured (if applicable)

---

**Status**: ✅ Production Ready | 🔧 Fully Automated | 📧 Email Verified
