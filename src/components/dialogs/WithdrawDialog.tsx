import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawDialog({ open, onOpenChange }: WithdrawDialogProps) {
  const { user } = useAuth();
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch user wallets with balance > 0
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

  const selectedWallet = wallets?.find(w => w.id === selectedWalletId);

  const handleWithdraw = async () => {
    if (!selectedWalletId || !address || !amount || !user || !selectedWallet) {
      toast.error('Please fill in all fields');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > Number(selectedWallet.balance)) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'withdrawal',
        asset_symbol: selectedWallet.asset_symbol,
        amount: withdrawAmount,
        status: 'pending',
        notes: `Withdrawal to ${address}`,
      });

      if (error) throw error;

      toast.success('Withdrawal request submitted');
      onOpenChange(false);
      setAddress('');
      setAmount('');
      setSelectedWalletId('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Crypto</DialogTitle>
          <DialogDescription>
            Send cryptocurrency to an external wallet
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Wallet</Label>
            <Select value={selectedWalletId} onValueChange={setSelectedWalletId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose wallet" />
              </SelectTrigger>
              <SelectContent>
                {wallets?.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.asset_name} ({wallet.asset_symbol}) - Balance: {Number(wallet.balance).toFixed(8)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Wallet Address</Label>
            <Input
              placeholder="Enter destination address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              step="0.00000001"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>⚠️ Important:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Withdrawals are processed manually for security</li>
              <li>Double-check the address before confirming</li>
              <li>Network fees will be deducted from the amount</li>
            </ul>
          </div>

          <Button onClick={handleWithdraw} className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Withdrawal'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}