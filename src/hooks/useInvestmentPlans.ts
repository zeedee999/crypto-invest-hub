import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useInvestmentPlans() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['investment-plans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('investment_plans')
        .select(`
          *,
          wallets:wallet_id (
            asset_symbol,
            asset_name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createPlan = useMutation({
    mutationFn: async (planData: {
      wallet_id: string;
      plan_type: string;
      amount: number;
      apy: number;
      term_months: number;
    }) => {
      if (!user) throw new Error('No user');
      
      const unlockDate = planData.term_months > 0 
        ? new Date(Date.now() + planData.term_months * 30 * 24 * 60 * 60 * 1000)
        : null;
      
      const status = planData.term_months > 0 ? 'locked' : 'active';
      
      const { data, error } = await supabase
        .from('investment_plans')
        .insert([{
          user_id: user.id,
          wallet_id: planData.wallet_id,
          plan_type: planData.plan_type,
          amount: planData.amount,
          apy: planData.apy,
          term_months: planData.term_months,
          status,
          unlock_date: unlockDate?.toISOString() || null,
          current_value: planData.amount,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-plans', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wallets', user?.id] });
    },
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('investment_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-plans', user?.id] });
    },
  });

  return {
    plans,
    isLoading,
    createPlan: createPlan.mutate,
    updatePlan: updatePlan.mutate,
  };
}
