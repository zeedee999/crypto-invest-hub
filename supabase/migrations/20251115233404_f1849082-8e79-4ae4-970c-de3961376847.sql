-- Add email column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- Update handle_new_user to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with email
  INSERT INTO public.profiles (id, full_name, phone, email, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email,
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET email = NEW.email;
  
  -- Insert user balance
  INSERT INTO public.user_balances (user_id, deposit_balance, profit_balance, total_bonus)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
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

-- Update existing profiles with email from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- Create user_balances for users who don't have them
INSERT INTO public.user_balances (user_id, deposit_balance, profit_balance, total_bonus)
SELECT p.id, 0, 0, 0
FROM public.profiles p
LEFT JOIN public.user_balances ub ON ub.user_id = p.id
WHERE ub.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;