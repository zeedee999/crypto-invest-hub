import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Investment product configurations
const INVESTMENT_PRODUCTS = [
  { planType: 'short-term', apy: 8, termMonths: 2 },
  { planType: 'semi-annual', apy: 15, termMonths: 6 },
  { planType: 'annual', apy: 25, termMonths: 12 },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting auto-invest check...');

    let depositProcessed = 0;
    let walletProcessed = 0;

    // ===== PART 1: Auto-invest approved deposits (2-10 minutes old) =====
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    const { data: deposits, error: depositsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('type', 'deposit')
      .eq('status', 'approved')
      .gte('approved_at', tenMinutesAgo)
      .lte('approved_at', twoMinutesAgo);

    if (depositsError) {
      console.error('Error fetching deposits:', depositsError);
      throw depositsError;
    }

    console.log(`Found ${deposits?.length || 0} deposits to check`);

    for (const deposit of deposits || []) {
      // Check if user has created any investment since this deposit
      const { data: investments, error: investmentError } = await supabase
        .from('investment_plans')
        .select('id')
        .eq('user_id', deposit.user_id)
        .gte('created_at', deposit.approved_at)
        .limit(1);

      if (investmentError) {
        console.error('Error checking investments:', investmentError);
        continue;
      }

      // If user has already created an investment, skip
      if (investments && investments.length > 0) {
        console.log(`User ${deposit.user_id} already has investment, skipping`);
        continue;
      }

      // Find the wallet for this asset
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', deposit.user_id)
        .eq('asset_symbol', deposit.asset_symbol)
        .gt('balance', 0)
        .single();

      if (walletError || !wallet) {
        console.error('Error finding wallet:', walletError);
        continue;
      }

      // Use the wallet balance for investment
      const investmentAmount = Number(wallet.balance);
      
      if (investmentAmount <= 0) {
        console.log(`Wallet balance is zero for user ${deposit.user_id}, skipping`);
        continue;
      }

      // Calculate unlock date (2 months from now)
      const unlockDate = new Date(Date.now() + 2 * 30 * 24 * 60 * 60 * 1000);

      // Create Short-Term Lock investment
      const { data: investmentPlan, error: createError } = await supabase
        .from('investment_plans')
        .insert({
          user_id: deposit.user_id,
          wallet_id: wallet.id,
          plan_type: 'short-term',
          amount: investmentAmount,
          apy: 8,
          term_months: 2,
          status: 'locked',
          unlock_date: unlockDate.toISOString(),
          current_value: investmentAmount,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating investment:', createError);
        continue;
      }

      // Deduct from wallet balance
      const { error: walletUpdateError } = await supabase
        .from('wallets')
        .update({ balance: 0 })
        .eq('id', wallet.id);

      if (walletUpdateError) {
        console.error('Error updating wallet:', walletUpdateError);
        continue;
      }

      // Send notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: deposit.user_id,
          type: 'investment',
          title: 'Auto Investment Created',
          message: `Your ${investmentAmount} ${deposit.asset_symbol} has been automatically invested in Short-Term Lock (2 months, 8% APY) to start earning returns.`,
        });

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }

      depositProcessed++;
      console.log(`Auto-invested ${investmentAmount} ${deposit.asset_symbol} for user ${deposit.user_id}`);
    }

    // ===== PART 2: Auto-invest uninvested wallet balances (15+ minutes old) =====
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { data: wallets, error: walletsError } = await supabase
      .from('wallets')
      .select('*')
      .gt('balance', 0)
      .lte('updated_at', fifteenMinutesAgo);

    if (walletsError) {
      console.error('Error fetching wallets:', walletsError);
    } else {
      console.log(`Found ${wallets?.length || 0} wallets with uninvested balances (15+ minutes old)`);

      for (const wallet of wallets || []) {
        const investmentAmount = Number(wallet.balance);
        
        if (investmentAmount <= 0) {
          console.log(`Wallet ${wallet.id} balance is zero, skipping`);
          continue;
        }

        // Randomly select an investment product
        const randomProduct = INVESTMENT_PRODUCTS[Math.floor(Math.random() * INVESTMENT_PRODUCTS.length)];
        
        // Calculate unlock date based on selected product
        const unlockDate = new Date(Date.now() + randomProduct.termMonths * 30 * 24 * 60 * 60 * 1000);

        // Create investment
        const { data: investmentPlan, error: createError } = await supabase
          .from('investment_plans')
          .insert({
            user_id: wallet.user_id,
            wallet_id: wallet.id,
            plan_type: randomProduct.planType,
            amount: investmentAmount,
            apy: randomProduct.apy,
            term_months: randomProduct.termMonths,
            status: 'locked',
            unlock_date: unlockDate.toISOString(),
            current_value: investmentAmount,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating investment from wallet:', createError);
          continue;
        }

        // Deduct from wallet balance
        const { error: walletUpdateError } = await supabase
          .from('wallets')
          .update({ balance: 0 })
          .eq('id', wallet.id);

        if (walletUpdateError) {
          console.error('Error updating wallet:', walletUpdateError);
          continue;
        }

        // Send notification
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: wallet.user_id,
            type: 'investment',
            title: 'Auto Investment Created',
            message: `Your ${investmentAmount} ${wallet.asset_symbol} that was idle for 15+ minutes has been automatically invested in ${randomProduct.planType} (${randomProduct.termMonths} months, ${randomProduct.apy}% APY) to start earning returns.`,
          });

        if (notificationError) {
          console.error('Error creating notification:', notificationError);
        }

        walletProcessed++;
        console.log(`Auto-invested ${investmentAmount} ${wallet.asset_symbol} from idle wallet for user ${wallet.user_id} into ${randomProduct.planType}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        depositsProcessed: depositProcessed,
        walletsProcessed: walletProcessed,
        total: depositProcessed + walletProcessed
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in auto-invest function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
