-- Alternative: Simpler trigger using Supabase webhooks
-- This approach uses supabase_functions.http_request which is available in Supabase

-- Create or replace the function that sends the webhook
CREATE OR REPLACE FUNCTION notify_kyc_status_change_webhook()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  function_url text;
BEGIN
  -- Only proceed if kyc_status has changed
  IF (TG_OP = 'UPDATE' AND OLD.kyc_status IS DISTINCT FROM NEW.kyc_status) OR 
     (TG_OP = 'INSERT' AND NEW.kyc_status IS NOT NULL) THEN
    
    -- Construct the Edge Function URL
    -- Replace YOUR_PROJECT_REF with your actual Supabase project reference
    function_url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-kyc-email';
    
    -- Make HTTP request to Edge Function
    SELECT INTO request_id
      extensions.http_post(
        url := function_url,
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || 
                   current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
        body := jsonb_build_object(
          'email', NEW.email,
          'full_name', COALESCE(NEW.full_name, 'User'),
          'kyc_status', NEW.kyc_status,
          'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.kyc_status ELSE NULL END
        )
      );
    
    -- Log the request (optional)
    RAISE NOTICE 'KYC email notification triggered for user % with status %', NEW.email, NEW.kyc_status;
    
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Failed to send KYC email notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS kyc_status_change_webhook_trigger ON profiles;

-- Create the trigger
CREATE TRIGGER kyc_status_change_webhook_trigger
  AFTER INSERT OR UPDATE OF kyc_status ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_kyc_status_change_webhook();

-- Grant permissions
GRANT EXECUTE ON FUNCTION notify_kyc_status_change_webhook() TO authenticated;
GRANT EXECUTE ON FUNCTION notify_kyc_status_change_webhook() TO service_role;

COMMENT ON FUNCTION notify_kyc_status_change_webhook() IS 'Sends email via Edge Function when KYC status changes';
COMMENT ON TRIGGER kyc_status_change_webhook_trigger ON profiles IS 'Triggers KYC email notification webhook';
