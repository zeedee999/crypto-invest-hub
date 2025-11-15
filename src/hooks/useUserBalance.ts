import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useUserBalance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: balance, isLoading } = useQuery({
    queryKey: ['user-balance', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        // If no balance exists, create one
        if (error.code === 'PGRST116') {
          const { data: newBalance, error: createError } = await supabase
            .from('user_balances')
            .insert({ user_id: user.id })
            .select()
            .single();
          
          if (createError) throw createError;
          return newBalance;
        }
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
  });

  const updateBalance = useMutation({
    mutationFn: async (updates: { 
      deposit_balance?: number; 
      profit_balance?: number; 
      total_bonus?: number;
    }) => {
      if (!user) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('user_balances')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-balance', user?.id] });
    },
  });

  return {
    balance,
    isLoading,
    updateBalance: updateBalance.mutate,
  };
}
