import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

interface SendCoinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendCoinDialog({ open, onOpenChange }: SendCoinDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const { data: wallets } = useQuery({
    queryKey: ['wallets', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id)
        .gt('balance', 0);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && open,
  });

  // Check if wallet has locked investment plans
  const { data: lockedPlans } = useQuery({
    queryKey: ['locked-plans', selectedWalletId],
    queryFn: async () => {
      if (!selectedWalletId) return [];
      
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('wallet_id', selectedWalletId)
        .eq('status', 'locked')
        .gt('unlock_date', new Date().toISOString());
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedWalletId && open,
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!selectedWalletId || !address || !amount) {
        throw new Error('Please fill in all fields');
      }

      const wallet = wallets?.find(w => w.id === selectedWalletId);
      if (!wallet) throw new Error('Wallet not found');

      // Check if there are locked plans
      if (lockedPlans && lockedPlans.length > 0) {
        const totalLocked = lockedPlans.reduce((sum, plan) => sum + Number(plan.amount), 0);
        const availableBalance = Number(wallet.balance) - totalLocked;
        
        if (Number(amount) > availableBalance) {
          throw new Error(
            `Insufficient available balance. ${totalLocked.toFixed(8)} ${wallet.asset_symbol} is locked in investment plans.`
          );
        }
      } else if (Number(amount) > Number(wallet.balance)) {
        throw new Error('Insufficient balance');
      }

      // Update wallet balance
      await supabase.from('wallets').update({
        balance: Number(wallet.balance) - Number(amount)
      }).eq('id', selectedWalletId);

      // Record transaction
      await supabase.from('transactions').insert({
        user_id: user?.id,
        type: 'withdrawal',
        amount: Number(amount),
        asset_symbol: wallet.asset_symbol,
        status: 'completed',
        notes: `Sent to ${address}`,
      });

      return wallet.asset_symbol;
    },
    onSuccess: (symbol) => {
      queryClient.invalidateQueries({ queryKey: ['wallets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
      toast.success(`${amount} ${symbol} sent successfully!`);
      onOpenChange(false);
      setSelectedWalletId('');
      setAddress('');
      setAmount('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const selectedWallet = wallets?.find(w => w.id === selectedWalletId);
  const totalLocked = lockedPlans?.reduce((sum, plan) => sum + Number(plan.amount), 0) || 0;
  const availableBalance = selectedWallet ? Number(selectedWallet.balance) - totalLocked : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Cryptocurrency</DialogTitle>
          <DialogDescription>Transfer coins to another wallet</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Select Wallet</Label>
            <Select value={selectedWalletId} onValueChange={setSelectedWalletId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a wallet" />
              </SelectTrigger>
              <SelectContent>
                {wallets?.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.asset_name} - {Number(wallet.balance).toFixed(8)} {wallet.asset_symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedWallet && totalLocked > 0 && (
            <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg text-sm">
              <p className="text-warning font-semibold">Locked Funds</p>
              <p className="text-muted-foreground">
                {totalLocked.toFixed(8)} {selectedWallet.asset_symbol} is locked in investment plans
              </p>
              <p className="text-success font-semibold mt-1">
                Available: {availableBalance.toFixed(8)} {selectedWallet.asset_symbol}
              </p>
            </div>
          )}

          <div>
            <Label>Recipient Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>

          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              step="0.00000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            {selectedWallet && (
              <p className="text-xs text-muted-foreground mt-1">
                Available: {availableBalance.toFixed(8)} {selectedWallet.asset_symbol}
              </p>
            )}
          </div>

          <Button 
            onClick={() => sendMutation.mutate()} 
            className="w-full"
            disabled={!selectedWalletId || !address || !amount || sendMutation.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {sendMutation.isPending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
