-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL, -- 'deposit', 'withdrawal', 'profit', 'bonus', 'admin'
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Add status field to profiles for suspension
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Update transactions table to include approval status
ALTER TABLE public.transactions ALTER COLUMN status SET DEFAULT 'pending';

-- Add approved_by and approved_at columns to transactions
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS approved_by uuid;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
  _user_id uuid,
  _type text,
  _title text,
  _message text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (_user_id, _type, _title, _message)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Trigger to create notification on deposit
CREATE OR REPLACE FUNCTION public.notify_on_deposit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.type = 'deposit' THEN
    PERFORM create_notification(
      NEW.user_id,
      'deposit',
      'Deposit Pending',
      'Your deposit of ' || NEW.amount || ' ' || NEW.asset_symbol || ' is pending approval.'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_deposit_notify
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  WHEN (NEW.type = 'deposit')
  EXECUTE FUNCTION public.notify_on_deposit();

-- Trigger to create notification on withdrawal
CREATE OR REPLACE FUNCTION public.notify_on_withdrawal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.type = 'withdraw' THEN
    PERFORM create_notification(
      NEW.user_id,
      'withdrawal',
      'Withdrawal Pending',
      'Your withdrawal of ' || NEW.amount || ' ' || NEW.asset_symbol || ' is pending approval.'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_withdrawal_notify
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  WHEN (NEW.type = 'withdraw')
  EXECUTE FUNCTION public.notify_on_withdrawal();

-- Function to notify on profit gain
CREATE OR REPLACE FUNCTION public.notify_profit_gain(
  _user_id uuid,
  _amount numeric,
  _plan_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM create_notification(
    _user_id,
    'profit',
    'Profit Earned!',
    'You earned ' || _amount || ' from your ' || _plan_type || ' investment plan.'
  );
END;
$$;

-- Update calculate_investment_gains to notify users
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
    WHERE status IN ('active', 'locked')
  LOOP
    time_elapsed := now() - plan.last_gain_calculated;
    days_elapsed := EXTRACT(EPOCH FROM time_elapsed) / 86400;
    
    IF days_elapsed >= 1 THEN
      gain_amount := (plan.current_value * plan.apy / 100 / 365) * days_elapsed;
      
      UPDATE investment_plans
      SET 
        current_value = current_value + gain_amount,
        last_gain_calculated = now(),
        updated_at = now()
      WHERE id = plan.id;
      
      -- Update user's profit balance
      UPDATE user_balances
      SET profit_balance = profit_balance + gain_amount
      WHERE user_id = plan.user_id;
      
      -- Notify user about profit
      PERFORM notify_profit_gain(plan.user_id, gain_amount, plan.plan_type);
      
      IF plan.unlock_date IS NOT NULL AND plan.unlock_date <= now() AND plan.status = 'locked' THEN
        UPDATE investment_plans
        SET status = 'completed', updated_at = now()
        WHERE id = plan.id;
        
        PERFORM create_notification(
          plan.user_id,
          'bonus',
          'Investment Unlocked!',
          'Your ' || plan.plan_type || ' investment plan has been completed and unlocked.'
        );
      END IF;
    END IF;
  END LOOP;
END;
$$;

-- Assign admin role to first user (you can change this later)
CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count integer;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_created_assign_role
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_first_admin();