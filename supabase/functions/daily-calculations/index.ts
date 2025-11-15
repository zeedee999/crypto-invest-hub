import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Run daily profit calculations
    const { error: profitError } = await supabase.rpc('calculate_daily_profits');
    if (profitError) {
      console.error('Error calculating profits:', profitError);
      throw profitError;
    }

    // Run daily bonus calculations
    const { error: bonusError } = await supabase.rpc('calculate_daily_bonus');
    if (bonusError) {
      console.error('Error calculating bonus:', bonusError);
      throw bonusError;
    }

    console.log('Daily calculations completed successfully');
    
    return new Response(
      JSON.stringify({ success: true, message: 'Daily calculations completed' }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in daily calculations:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
