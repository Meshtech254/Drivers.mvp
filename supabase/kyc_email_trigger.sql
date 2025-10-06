-- SQL Trigger to automatically send emails when KYC status changes
-- This trigger calls the Supabase Edge Function whenever kyc_status is updated

-- First, create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION notify_kyc_status_change()
RETURNS TRIGGER AS $$
DECLARE
  function_url text;
  service_role_key text;
  payload json;
BEGIN
  -- Only proceed if kyc_status has changed
  IF (TG_OP = 'UPDATE' AND OLD.kyc_status IS DISTINCT FROM NEW.kyc_status) OR 
     (TG_OP = 'INSERT' AND NEW.kyc_status IS NOT NULL) THEN
    
    -- Get the Supabase project URL and service role key from environment
    -- These should be set in your Supabase project settings
    function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-kyc-email';
    service_role_key := current_setting('app.settings.supabase_service_role_key', true);
    
    -- Build the payload
    payload := json_build_object(
      'email', NEW.email,
      'full_name', COALESCE(NEW.full_name, 'User'),
      'kyc_status', NEW.kyc_status,
      'old_status', OLD.kyc_status
    );
    
    -- Call the Edge Function asynchronously using pg_net extension
    -- Note: pg_net must be enabled in your Supabase project
    PERFORM
      net.http_post(
        url := function_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || service_role_key
        ),
        body := payload::jsonb
      );
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS kyc_status_change_trigger ON profiles;

-- Create the trigger
CREATE TRIGGER kyc_status_change_trigger
  AFTER INSERT OR UPDATE OF kyc_status ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_kyc_status_change();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION notify_kyc_status_change() TO authenticated;
GRANT EXECUTE ON FUNCTION notify_kyc_status_change() TO service_role;

-- Enable pg_net extension if not already enabled
-- Run this in the Supabase SQL Editor:
-- CREATE EXTENSION IF NOT EXISTS pg_net;

COMMENT ON FUNCTION notify_kyc_status_change() IS 'Sends email notification when KYC status changes';
COMMENT ON TRIGGER kyc_status_change_trigger ON profiles IS 'Triggers email notification on KYC status change';
