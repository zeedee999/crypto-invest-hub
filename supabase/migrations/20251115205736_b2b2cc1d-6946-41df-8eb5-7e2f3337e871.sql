-- Function to calculate and add daily profit (1% of current investment value)
CREATE OR REPLACE FUNCTION public.calculate_daily_profits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  plan RECORD;
  daily_profit numeric;
BEGIN
  FOR plan IN 
    SELECT * FROM investment_plans 
    WHERE status IN ('active', 'locked')
  LOOP
    -- Calculate 1% daily profit on current investment value
    daily_profit := plan.current_value * 0.01;
    
    -- Update investment current value
    UPDATE investment_plans
    SET 
      current_value = current_value + daily_profit,
      last_gain_calculated = now(),
      updated_at = now()
    WHERE id = plan.id;
    
    -- Update user's profit balance
    UPDATE user_balances
    SET 
      profit_balance = profit_balance + daily_profit,
      updated_at = now()
    WHERE user_id = plan.user_id;
    
    -- Check if investment should be unlocked
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
  END LOOP;
END;
$function$;

-- Function to calculate and add daily bonus (0.001% of total balance)
CREATE OR REPLACE FUNCTION public.calculate_daily_bonus()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_record RECORD;
  daily_bonus numeric;
  total_balance numeric;
BEGIN
  FOR user_record IN 
    SELECT * FROM user_balances
  LOOP
    -- Calculate total balance (deposit + profit + bonus)
    total_balance := user_record.deposit_balance + user_record.profit_balance + user_record.total_bonus;
    
    -- Calculate 0.001% daily bonus
    daily_bonus := total_balance * 0.00001;
    
    -- Update user's bonus
    UPDATE user_balances
    SET 
      total_bonus = total_bonus + daily_bonus,
      updated_at = now()
    WHERE user_id = user_record.user_id;
  END LOOP;
END;
$function$;