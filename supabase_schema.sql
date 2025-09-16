-- 1. Create the license_keys table
CREATE TABLE license_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  duration_days INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  activated_by_user_id UUID REFERENCES auth.users(id)
);

-- 2. Create the user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' NOT NULL,
  generations_today INT DEFAULT 0 NOT NULL,
  last_generation_date DATE,
  license_key_id UUID REFERENCES license_keys(id)
);

-- 3. Function to create a user profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger to call the function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Function to activate a license key
CREATE OR REPLACE FUNCTION activate_license_key(user_id UUID, license_key TEXT)
RETURNS JSONB AS $$
DECLARE
  key_record RECORD;
  profile_record RECORD;
BEGIN
  -- Find the license key
  SELECT * INTO key_record FROM license_keys WHERE key = license_key AND is_active = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Invalid or inactive license key.');
  END IF;

  -- Check if the user already has a pro plan
  SELECT * INTO profile_record FROM user_profiles WHERE id = user_id;
  IF profile_record.plan = 'pro' AND profile_record.license_key_id IS NOT NULL THEN
    -- Check if the current license is expired
    DECLARE
      current_key_record RECORD;
    BEGIN
      SELECT * INTO current_key_record FROM license_keys WHERE id = profile_record.license_key_id;
      IF current_key_record.expires_at > now() THEN
        RETURN jsonb_build_object('success', false, 'message', 'You already have an active Pro plan.');
      END IF;
    END;
  END IF;

  -- Update the license key
  UPDATE license_keys
  SET
    is_active = false,
    activated_at = now(),
    expires_at = now() + (key_record.duration_days * INTERVAL '1 day'),
    activated_by_user_id = user_id
  WHERE id = key_record.id;

  -- Update the user's profile
  UPDATE user_profiles
  SET
    plan = 'pro',
    license_key_id = key_record.id
  WHERE id = user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Pro plan activated successfully!', 'expires_at', key_record.expires_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Set up Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Allow individual user access to their own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Allow admins (or a specific role) to manage license keys
-- For simplicity, this example allows any authenticated user to read license keys.
-- In a production environment, you should restrict this to an 'admin' role.
CREATE POLICY "Allow authenticated users to read license keys"
ON license_keys FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin to manage license keys"
ON license_keys FOR ALL
USING (
  -- Replace with your actual admin user ID or a role-based check
  auth.uid() IN ('tenten')
)
WITH CHECK (
  auth.uid() IN ('tenten')
);
