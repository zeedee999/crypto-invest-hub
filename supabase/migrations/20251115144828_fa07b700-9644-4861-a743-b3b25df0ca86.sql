-- Create user_balances table for tracking deposit, profit, and bonus balances
CREATE TABLE public.user_balances (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  deposit_balance numeric NOT NULL DEFAULT 0,
  profit_balance numeric NOT NULL DEFAULT 0,
  total_bonus numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_balance UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_balances
CREATE POLICY "Users can view own balance"
  ON public.user_balances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own balance"
  ON public.user_balances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own balance"
  ON public.user_balances FOR UPDATE
  USING (auth.uid() = user_id);

-- Create investment_plans table for saving plans with locks
CREATE TABLE public.investment_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  wallet_id uuid NOT NULL,
  plan_type text NOT NULL, -- 'auto-invest', 'fixed-term', 'flexible-earn'
  amount numeric NOT NULL,
  apy numeric NOT NULL, -- Annual Percentage Yield
  term_months integer NOT NULL DEFAULT 0, -- 0 for flexible, 1-12+ for fixed
  status text NOT NULL DEFAULT 'active', -- 'active', 'locked', 'completed', 'cancelled'
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  unlock_date timestamp with time zone, -- NULL for flexible, calculated for fixed
  current_value numeric NOT NULL DEFAULT 0, -- Amount + accumulated gains
  last_gain_calculated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for investment_plans
CREATE POLICY "Users can view own investment plans"
  ON public.investment_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own investment plans"
  ON public.investment_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investment plans"
  ON public.investment_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- Create coin_swaps table for tracking swap transactions
CREATE TABLE public.coin_swaps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  from_wallet_id uuid NOT NULL,
  to_wallet_id uuid NOT NULL,
  from_amount numeric NOT NULL,
  to_amount numeric NOT NULL,
  from_symbol text NOT NULL,
  to_symbol text NOT NULL,
  exchange_rate numeric NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coin_swaps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coin_swaps
CREATE POLICY "Users can view own swaps"
  ON public.coin_swaps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own swaps"
  ON public.coin_swaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for user_balances updated_at
CREATE TRIGGER update_user_balances_updated_at
  BEFORE UPDATE ON public.user_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for investment_plans updated_at
CREATE TRIGGER update_investment_plans_updated_at
  BEFORE UPDATE ON public.investment_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate and update investment gains
CREATE OR REPLACE FUNCTION public.calculate_investment_gains()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  plan RECORD;
  time_elapsed interval;
  days_elapsed numeric;
  gain_amount numeric;
BEGIN
  FOR plan IN 
    SELECT * FROM investment_plans 
    WHERE status = 'active' OR status = 'locked'
  LOOP
    -- Calculate time elapsed since last gain calculation
    time_elapsed := now() - plan.last_gain_calculated;
    days_elapsed := EXTRACT(EPOCH FROM time_elapsed) / 86400;
    
    -- Calculate gain: (amount * APY / 365) * days_elapsed
    gain_amount := (plan.current_value * plan.apy / 100 / 365) * days_elapsed;
    
    -- Update current value and last calculated timestamp
    UPDATE investment_plans
    SET 
      current_value = current_value + gain_amount,
      last_gain_calculated = now(),
      updated_at = now()
    WHERE id = plan.id;
    
    -- Check if fixed-term plan is unlocked
    IF plan.unlock_date IS NOT NULL AND plan.unlock_date <= now() AND plan.status = 'locked' THEN
      UPDATE investment_plans
      SET status = 'completed', updated_at = now()
      WHERE id = plan.id;
    END IF;
  END LOOP;
END;
$$;

-- Function to initialize user balance when user signs up
CREATE OR REPLACE FUNCTION public.initialize_user_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_balances (user_id, deposit_balance, profit_balance, total_bonus)
  VALUES (NEW.id, 0, 0, 0);
  RETURN NEW;
END;
$$;

-- Trigger to initialize user balance on profile creation
CREATE TRIGGER on_profile_created_initialize_balance
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_user_balance();