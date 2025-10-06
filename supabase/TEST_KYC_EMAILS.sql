-- ============================================================================
-- TEST SCRIPT: KYC Email Notifications
-- ============================================================================
-- Use this script to test your KYC email notification setup
-- Make sure you've run QUICK_SETUP.sql first!
-- ============================================================================

-- Step 1: Check if the trigger is installed
SELECT 
  '✓ Checking trigger installation...' as step,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_name = 'trigger_send_kyc_email';

-- Expected: Should show one row with trigger_send_kyc_email

-- Step 2: Check if the function exists
SELECT 
  '✓ Checking function installation...' as step,
  proname as function_name,
  pronargs as num_args
FROM pg_proc
WHERE proname = 'send_kyc_email_notification';

-- Expected: Should show one row with send_kyc_email_notification

-- Step 3: Check if HTTP extension is enabled
SELECT 
  '✓ Checking HTTP extension...' as step,
  extname as extension_name,
  extversion as version
FROM pg_extension
WHERE extname = 'http';

-- Expected: Should show http extension with version

-- ============================================================================
-- IMPORTANT: Before running the tests below, replace 'test@example.com' 
-- with a real email address you have access to!
-- ============================================================================

-- Step 4: Create a test profile (if it doesn't exist)
-- Replace with your test email
DO $$
DECLARE
  test_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO profiles (id, email, full_name, is_driver, kyc_status)
  VALUES (
    test_user_id,
    'test@example.com',  -- ⚠️ REPLACE WITH YOUR EMAIL
    'Test Driver',
    true,
    NULL
  )
  ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Test user created with ID: %', test_user_id;
END $$;

-- Step 5: View the test profile
SELECT 
  '✓ Test profile created' as step,
  id,
  email,
  full_name,
  kyc_status
FROM profiles
WHERE email = 'test@example.com';  -- ⚠️ REPLACE WITH YOUR EMAIL

-- ============================================================================
-- TEST 1: Test PENDING status email
-- ============================================================================
-- This should send an email confirming KYC documents were received

UPDATE profiles 
SET kyc_status = 'pending'
WHERE email = 'test@example.com';  -- ⚠️ REPLACE WITH YOUR EMAIL

-- Wait a few seconds, then check your email inbox for:
-- Subject: "KYC Documents Received - EasyDriverHire"

-- ============================================================================
-- TEST 2: Test APPROVED status email
-- ============================================================================
-- This should send a congratulations email

UPDATE profiles 
SET kyc_status = 'approved'
WHERE email = 'test@example.com';  -- ⚠️ REPLACE WITH YOUR EMAIL

-- Wait a few seconds, then check your email inbox for:
-- Subject: "KYC Verified Successfully - EasyDriverHire"

-- ============================================================================
-- TEST 3: Test REJECTED status email
-- ============================================================================
-- This should send a rejection email with resubmission instructions

UPDATE profiles 
SET kyc_status = 'rejected'
WHERE email = 'test@example.com';  -- ⚠️ REPLACE WITH YOUR EMAIL

-- Wait a few seconds, then check your email inbox for:
-- Subject: "KYC Documents Declined - EasyDriverHire"

-- ============================================================================
-- TEST 4: Verify no duplicate emails are sent
-- ============================================================================
-- Updating to the same status should NOT send another email

UPDATE profiles 
SET kyc_status = 'rejected'
WHERE email = 'test@example.com';  -- ⚠️ REPLACE WITH YOUR EMAIL

-- Expected: NO email should be sent (status didn't change)

-- ============================================================================
-- CLEANUP: Remove test profile (optional)
-- ============================================================================
-- Uncomment to delete the test profile after testing

-- DELETE FROM profiles WHERE email = 'test@example.com';

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- Check Postgres logs for any errors
-- Go to: Supabase Dashboard → Logs → Postgres Logs

-- Test your email API endpoint directly:
-- curl -X POST http://localhost:3000/api/notifications/send-email \
--   -H "Content-Type: application/json" \
--   -d '{"to":"test@example.com","subject":"Test","text":"Test message"}'

-- Verify RESEND_API_KEY is set in your .env.local file

-- Check if emails are in spam folder

-- View recent profile updates:
SELECT 
  id,
  email,
  full_name,
  kyc_status,
  created_at
FROM profiles
WHERE email = 'test@example.com'
ORDER BY created_at DESC;

-- ============================================================================
-- SUCCESS CRITERIA
-- ============================================================================
-- ✓ Trigger and function are installed
-- ✓ HTTP extension is enabled
-- ✓ Test profile created
-- ✓ Received "pending" email
-- ✓ Received "approved" email
-- ✓ Received "rejected" email
-- ✓ No duplicate email when status unchanged
-- ============================================================================
