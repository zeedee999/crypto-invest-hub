import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CryptoWallet {
  id: string;
  coin_name: string;
  coin_symbol: string;
  chain: string;
  wallet_address: string;
  qr_code_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useCryptoWallets() {
  const queryClient = useQueryClient();

  const { data: wallets, isLoading } = useQuery({
    queryKey: ['crypto-wallets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crypto_wallet_addresses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CryptoWallet[];
    },
  });

  const createWallet = useMutation({
    mutationFn: async (walletData: Omit<CryptoWallet, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('crypto_wallet_addresses')
        .insert(walletData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crypto-wallets'] });
      toast.success('Wallet address added successfully');
    },
    onError: (error) => {
      console.error('Create wallet error:', error);
      toast.error('Failed to add wallet address');
    },
  });

  const updateWallet = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CryptoWallet> }) => {
      const { data, error } = await supabase
        .from('crypto_wallet_addresses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crypto-wallets'] });
      toast.success('Wallet address updated successfully');
    },
    onError: (error) => {
      console.error('Update wallet error:', error);
      toast.error('Failed to update wallet address');
    },
  });

  const deleteWallet = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crypto_wallet_addresses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crypto-wallets'] });
      toast.success('Wallet address deleted successfully');
    },
    onError: (error) => {
      console.error('Delete wallet error:', error);
      toast.error('Failed to delete wallet address');
    },
  });

  const uploadQrCode = async (file: File, walletId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${walletId}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('qr-codes')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('qr-codes')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return {
    wallets,
    isLoading,
    createWallet: createWallet.mutate,
    updateWallet: updateWallet.mutate,
    deleteWallet: deleteWallet.mutate,
    uploadQrCode,
    isCreating: createWallet.isPending,
    isUpdating: updateWallet.isPending,
    isDeleting: deleteWallet.isPending,
  };
}
