-- ============================================================================
-- KYC Email Notification Setup
-- ============================================================================
-- This file sets up automatic email notifications for KYC status changes
-- using a database trigger that calls your existing Next.js API endpoint
-- ============================================================================

-- Step 1: Enable the http extension (if not already enabled)
-- This allows PostgreSQL to make HTTP requests
CREATE EXTENSION IF NOT EXISTS http;

-- Step 2: Create a function to send KYC email notifications
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
        -- No email for other statuses
        RETURN NEW;
    END CASE;
    
    -- Get the API URL from environment or use default
    -- You can set this in Supabase Dashboard -> Project Settings -> Database -> Custom Config
    api_url := COALESCE(
      current_setting('app.api_url', true),
      'http://localhost:3000'
    ) || '/api/notifications/send-email';
    
    -- Make HTTP POST request to your Next.js API
    BEGIN
      SELECT INTO api_response * FROM http((
        'POST',
        api_url,
        ARRAY[
          http_header('Content-Type', 'application/json')
        ],
        'application/json',
        json_build_object(
          'to', NEW.email,
          'subject', email_subject,
          'text', email_body
        )::text
      ));
      
      -- Log the response (optional, for debugging)
      RAISE NOTICE 'Email API response: % - %', api_response.status, api_response.content;
      
    EXCEPTION WHEN OTHERS THEN
      -- Don't fail the transaction if email fails
      RAISE WARNING 'Failed to send KYC email to %: %', NEW.email, SQLERRM;
    END;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_send_kyc_email ON profiles;

-- Step 4: Create the trigger
CREATE TRIGGER trigger_send_kyc_email
  AFTER INSERT OR UPDATE OF kyc_status ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION send_kyc_email_notification();

-- Step 5: Grant necessary permissions
GRANT EXECUTE ON FUNCTION send_kyc_email_notification() TO authenticated;
GRANT EXECUTE ON FUNCTION send_kyc_email_notification() TO service_role;

-- Add helpful comments
COMMENT ON FUNCTION send_kyc_email_notification() IS 
  'Automatically sends email notifications when KYC status changes (pending, approved, rejected)';
COMMENT ON TRIGGER trigger_send_kyc_email ON profiles IS 
  'Triggers email notification whenever kyc_status column is updated';

-- ============================================================================
-- Configuration Instructions:
-- ============================================================================
-- 1. Enable the http extension (done above)
-- 2. Set your API URL in Supabase Dashboard:
--    Project Settings -> Database -> Custom Config
--    Add: app.api_url = 'https://your-domain.com'
-- 3. Make sure your RESEND_API_KEY is set in .env.local
-- 4. Test by updating a profile's kyc_status:
--    UPDATE profiles SET kyc_status = 'approved' WHERE id = 'some-user-id';
-- ============================================================================

-- Test query to verify trigger is installed:
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_send_kyc_email';
