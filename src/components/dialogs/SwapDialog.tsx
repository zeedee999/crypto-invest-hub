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
import { ArrowDownUp, RefreshCw } from 'lucide-react';
import { useCryptoRates } from '@/hooks/useCryptoRates';

interface SwapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'BNB', name: 'BNB' },
];

export function SwapDialog({ open, onOpenChange }: SwapDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [fromSymbol, setFromSymbol] = useState('');
  const [toSymbol, setToSymbol] = useState('');
  const [amount, setAmount] = useState('');

  const { data: cryptoRates, refetch: refetchRates, isRefetching } = useCryptoRates();

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

  const getOrCreateWallet = async (symbol: string) => {
    let wallet = wallets?.find(w => w.asset_symbol === symbol);
    
    if (!wallet) {
      const crypto = AVAILABLE_CRYPTOS.find(c => c.symbol === symbol);
      if (!crypto) throw new Error('Invalid cryptocurrency');

      const { data: newWallet, error } = await supabase
        .from('wallets')
        .insert({
          user_id: user?.id,
          asset_symbol: symbol,
          asset_name: crypto.name,
          balance: 0,
        })
        .select()
        .single();

      if (error) throw error;
      wallet = newWallet;
    }

    return wallet;
  };

  const swapMutation = useMutation({
    mutationFn: async () => {
      if (!fromSymbol || !toSymbol || !amount) {
        throw new Error('Please fill in all fields');
      }

      if (fromSymbol === toSymbol) {
        throw new Error('Cannot swap the same currency');
      }

      if (!cryptoRates) {
        throw new Error('Exchange rates not available');
      }

      const fromWallet = wallets?.find(w => w.asset_symbol === fromSymbol);
      if (!fromWallet) {
        throw new Error('You do not have a wallet for this currency');
      }

      if (Number(amount) > Number(fromWallet.balance)) {
        throw new Error('Insufficient balance');
      }

      const exchangeRate = (cryptoRates[fromSymbol] || 0) / (cryptoRates[toSymbol] || 1);
      const toAmount = Number(amount) * exchangeRate;

      // Get or create destination wallet
      const toWallet = await getOrCreateWallet(toSymbol);

      // Update from wallet balance
      await supabase.from('wallets').update({
        balance: Number(fromWallet.balance) - Number(amount)
      }).eq('id', fromWallet.id);

      // Update to wallet balance
      await supabase.from('wallets').update({
        balance: Number(toWallet.balance) + toAmount
      }).eq('id', toWallet.id);

      // Record swap
      await supabase.from('coin_swaps').insert({
        user_id: user?.id,
        from_wallet_id: fromWallet.id,
        to_wallet_id: toWallet.id,
        from_amount: Number(amount),
        to_amount: toAmount,
        from_symbol: fromSymbol,
        to_symbol: toSymbol,
        exchange_rate: exchangeRate,
      });

      return { toAmount };
    },
    onSuccess: ({ toAmount }) => {
      queryClient.invalidateQueries({ queryKey: ['wallets', user?.id] });
      toast.success(`Swapped successfully! Received ${toAmount.toFixed(8)} ${toSymbol}`);
      onOpenChange(false);
      setFromSymbol('');
      setToSymbol('');
      setAmount('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const fromWallet = wallets?.find(w => w.asset_symbol === fromSymbol);
  const fromCrypto = AVAILABLE_CRYPTOS.find(c => c.symbol === fromSymbol);
  const toCrypto = AVAILABLE_CRYPTOS.find(c => c.symbol === toSymbol);
  
  const exchangeRate = fromSymbol && toSymbol && cryptoRates
    ? (cryptoRates[fromSymbol] || 0) / (cryptoRates[toSymbol] || 1)
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
            <div className="flex items-center justify-between mb-2">
              <Label>From</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetchRates()}
                disabled={isRefetching}
                className="h-auto p-1"
              >
                <RefreshCw className={`h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <Select value={fromSymbol} onValueChange={setFromSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Select coin to swap" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_CRYPTOS.map((crypto) => {
                  const wallet = wallets?.find(w => w.asset_symbol === crypto.symbol);
                  const balance = wallet ? Number(wallet.balance) : 0;
                  const hasBalance = balance > 0;
                  const price = cryptoRates?.[crypto.symbol] || 0;
                  
                  return (
                    <SelectItem 
                      key={crypto.symbol} 
                      value={crypto.symbol}
                      disabled={!hasBalance}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{crypto.name} ({crypto.symbol})</span>
                        <span className={hasBalance ? 'text-foreground' : 'text-muted-foreground'}>
                          {balance.toFixed(8)} ${price.toFixed(2)}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {fromWallet && (
              <p className="text-sm text-muted-foreground mt-1">
                Available: {Number(fromWallet.balance).toFixed(8)} {fromSymbol}
              </p>
            )}
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
            <Select value={toSymbol} onValueChange={setToSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Select coin to receive" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_CRYPTOS.filter(crypto => crypto.symbol !== fromSymbol).map((crypto) => {
                  const wallet = wallets?.find(w => w.asset_symbol === crypto.symbol);
                  const balance = wallet ? Number(wallet.balance).toFixed(8) : '0.00000000';
                  const price = cryptoRates?.[crypto.symbol] || 0;
                  
                  return (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      <div className="flex items-center justify-between w-full">
                        <span>{crypto.name} ({crypto.symbol})</span>
                        <span className="text-muted-foreground">
                          {balance} ${price.toFixed(2)}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {estimatedReceive > 0 && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange Rate:</span>
                  <span className="font-semibold">
                    1 {fromCrypto?.symbol} = {exchangeRate.toFixed(8)} {toCrypto?.symbol}
                  </span>
                </div>
                <div className="flex justify-between text-success">
                  <span>You'll Receive:</span>
                  <span className="font-semibold">
                    {estimatedReceive.toFixed(8)} {toCrypto?.symbol}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={() => swapMutation.mutate()} 
            className="w-full"
            disabled={!fromSymbol || !toSymbol || !amount || fromSymbol === toSymbol || swapMutation.isPending}
          >
            {swapMutation.isPending ? 'Swapping...' : 'Swap Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
