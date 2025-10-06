-- ============================================================================
-- QUICK SETUP: KYC Email Notifications
-- ============================================================================
-- Copy and paste this entire file into Supabase SQL Editor and run it
-- This will set up automatic email notifications for KYC status changes
-- ============================================================================

-- Step 1: Enable HTTP extension
CREATE EXTENSION IF NOT EXISTS http;

-- Step 2: Create the email notification function
CREATE OR REPLACE FUNCTION send_kyc_email_notification()
RETURNS TRIGGER AS $$
DECLARE
  api_url text;
  api_response http_response;
  email_subject text;
  email_body text;
BEGIN
  -- Only send email if kyc_status has actually changed
  IF (TG_OP = 'UPDATE' AND OLD.kyc_status IS DISTINCT FROM NEW.kyc_status) OR 
     (TG_OP = 'INSERT' AND NEW.kyc_status IS NOT NULL) THEN
    
    -- Skip if email is not set
    IF NEW.email IS NULL OR NEW.email = '' THEN
      RETURN NEW;
    END IF;
    
    -- Determine email content based on status
    CASE NEW.kyc_status
      WHEN 'pending' THEN
        email_subject := 'KYC Documents Received - EasyDriverHire';
        email_body := 'We have received your KYC documents and will notify you when they are verified. Thank you for your patience.';
      WHEN 'approved' THEN
        email_subject := 'KYC Verified Successfully - EasyDriverHire';
        email_body := 'Congratulations! Your KYC has been verified successfully. You can now access all driver features on our platform.';
      WHEN 'rejected' THEN
        email_subject := 'KYC Documents Declined - EasyDriverHire';
        email_body := 'Your KYC documents have been declined. Please review and upload your documents again. Make sure all documents are clear and valid.';
      ELSE
        RETURN NEW;
    END CASE;
    
    -- Get API URL (defaults to localhost for development)
    api_url := COALESCE(
      current_setting('app.api_url', true),
      'http://localhost:3000'
    ) || '/api/notifications/send-email';
    
    -- Make HTTP POST request to Next.js API
    BEGIN
      SELECT INTO api_response * FROM http((
        'POST',
        api_url,
        ARRAY[http_header('Content-Type', 'application/json')],
        'application/json',
        json_build_object(
          'to', NEW.email,
          'subject', email_subject,
          'text', email_body
        )::text
      ));
      
      RAISE NOTICE 'KYC email sent to % with status %', NEW.email, NEW.kyc_status;
      
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to send KYC email to %: %', NEW.email, SQLERRM;
    END;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create the trigger
DROP TRIGGER IF EXISTS trigger_send_kyc_email ON profiles;

CREATE TRIGGER trigger_send_kyc_email
  AFTER INSERT OR UPDATE OF kyc_status ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION send_kyc_email_notification();

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION send_kyc_email_notification() TO authenticated;
GRANT EXECUTE ON FUNCTION send_kyc_email_notification() TO service_role;

-- ============================================================================
-- ✅ SETUP COMPLETE!
-- ============================================================================
-- The trigger is now active and will send emails when kyc_status changes.
--
-- NEXT STEPS:
-- 1. Make sure RESEND_API_KEY is set in your .env.local file
-- 2. Test by updating a profile's kyc_status:
--    UPDATE profiles SET kyc_status = 'pending' WHERE email = 'your-test@email.com';
--
-- For production, set your API URL:
-- Project Settings → Database → Custom Config
-- Add: app.api_url = https://your-domain.com
-- ============================================================================

-- Verify installation
SELECT 
  'Trigger installed successfully!' as status,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_name = 'trigger_send_kyc_email';
