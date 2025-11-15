-- Drop triggers with CASCADE
DROP TRIGGER IF EXISTS on_profile_created_initialize_balance ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;

-- Drop old function with CASCADE
DROP FUNCTION IF EXISTS public.initialize_user_balance() CASCADE;

-- Create function to handle new user profile and balance creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, phone, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert user balance
  INSERT INTO public.user_balances (user_id, deposit_balance, profit_balance, total_bonus)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT DO NOTHING;
  
  -- Assign role (admin for first user, user for others)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 
    CASE 
      WHEN (SELECT COUNT(*) FROM auth.users) = 1 THEN 'admin'::app_role
      ELSE 'user'::app_role
    END
  )
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Populate profiles for existing users
INSERT INTO public.profiles (id, full_name, status)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  'active'
FROM auth.users au
ON CONFLICT (id) DO NOTHING;

-- Add current user as admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('ce20a3f3-c121-49b3-914d-e7e46cac455b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;