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
import { ArrowDownUp } from 'lucide-react';

interface SwapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SwapDialog({ open, onOpenChange }: SwapDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [fromWalletId, setFromWalletId] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [amount, setAmount] = useState('');

  const { data: wallets } = useQuery({
    queryKey: ['wallets', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && open,
  });

  // Mock exchange rates (in production, fetch from real API)
  const getExchangeRate = (fromSymbol: string, toSymbol: string) => {
    const rates: Record<string, number> = {
      BTC: 96000,
      ETH: 3180,
      USDT: 1,
      BNB: 936,
    };
    return rates[toSymbol] / rates[fromSymbol];
  };

  const swapMutation = useMutation({
    mutationFn: async () => {
      if (!fromWalletId || !toWalletId || !amount) {
        throw new Error('Please fill in all fields');
      }

      const fromWallet = wallets?.find(w => w.id === fromWalletId);
      const toWallet = wallets?.find(w => w.id === toWalletId);

      if (!fromWallet || !toWallet) throw new Error('Invalid wallets');
      if (Number(amount) > Number(fromWallet.balance)) {
        throw new Error('Insufficient balance');
      }

      const exchangeRate = getExchangeRate(fromWallet.asset_symbol, toWallet.asset_symbol);
      const toAmount = Number(amount) * exchangeRate;

      // Update balances
      await supabase.from('wallets').update({
        balance: Number(fromWallet.balance) - Number(amount)
      }).eq('id', fromWalletId);

      await supabase.from('wallets').update({
        balance: Number(toWallet.balance) + toAmount
      }).eq('id', toWalletId);

      // Record swap
      await supabase.from('coin_swaps').insert({
        user_id: user?.id,
        from_wallet_id: fromWalletId,
        to_wallet_id: toWalletId,
        from_amount: Number(amount),
        to_amount: toAmount,
        from_symbol: fromWallet.asset_symbol,
        to_symbol: toWallet.asset_symbol,
        exchange_rate: exchangeRate,
      });

      return { toAmount };
    },
    onSuccess: ({ toAmount }) => {
      queryClient.invalidateQueries({ queryKey: ['wallets', user?.id] });
      toast.success(`Swapped successfully! Received ${toAmount.toFixed(8)}`);
      onOpenChange(false);
      setFromWalletId('');
      setToWalletId('');
      setAmount('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const fromWallet = wallets?.find(w => w.id === fromWalletId);
  const toWallet = wallets?.find(w => w.id === toWalletId);
  const exchangeRate = fromWallet && toWallet 
    ? getExchangeRate(fromWallet.asset_symbol, toWallet.asset_symbol)
    : 0;
  const estimatedReceive = amount && exchangeRate ? Number(amount) * exchangeRate : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Swap Coins</DialogTitle>
          <DialogDescription>Exchange one cryptocurrency for another</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>From</Label>
            <Select value={fromWalletId} onValueChange={setFromWalletId}>
              <SelectTrigger>
                <SelectValue placeholder="Select coin to swap" />
              </SelectTrigger>
              <SelectContent>
                {wallets?.filter(w => Number(w.balance) > 0).map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.asset_name} - {Number(wallet.balance).toFixed(8)} {wallet.asset_symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          </div>

          <div className="flex justify-center">
            <ArrowDownUp className="h-6 w-6 text-primary" />
          </div>

          <div>
            <Label>To</Label>
            <Select value={toWalletId} onValueChange={setToWalletId}>
              <SelectTrigger>
                <SelectValue placeholder="Select coin to receive" />
              </SelectTrigger>
              <SelectContent>
                {wallets?.filter(w => w.id !== fromWalletId).map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.asset_name} ({wallet.asset_symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {estimatedReceive > 0 && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange Rate:</span>
                  <span className="font-semibold">
                    1 {fromWallet?.asset_symbol} = {exchangeRate.toFixed(8)} {toWallet?.asset_symbol}
                  </span>
                </div>
                <div className="flex justify-between text-success">
                  <span>You'll Receive:</span>
                  <span className="font-semibold">
                    {estimatedReceive.toFixed(8)} {toWallet?.asset_symbol}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={() => swapMutation.mutate()} 
            className="w-full"
            disabled={!fromWalletId || !toWalletId || !amount || swapMutation.isPending}
          >
            {swapMutation.isPending ? 'Swapping...' : 'Swap Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
