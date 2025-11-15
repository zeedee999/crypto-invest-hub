-- Update the initialize_user_balance function to handle conflicts
CREATE OR REPLACE FUNCTION public.initialize_user_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_balances (user_id, deposit_balance, profit_balance, total_bonus)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;