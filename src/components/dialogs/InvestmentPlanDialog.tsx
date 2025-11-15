import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestmentPlans } from '@/hooks/useInvestmentPlans';
import { toast } from 'sonner';

interface InvestmentPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planType: 'auto-invest' | 'fixed-term' | 'flexible-earn';
  defaultApy: number;
}

export function InvestmentPlanDialog({ open, onOpenChange, planType, defaultApy }: InvestmentPlanDialogProps) {
  const { user } = useAuth();
  const { createPlan } = useInvestmentPlans();
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [termMonths, setTermMonths] = useState(planType === 'fixed-term' ? '1' : '0');

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

  const handleCreate = async () => {
    if (!selectedWalletId || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const wallet = wallets?.find(w => w.id === selectedWalletId);
    if (!wallet || Number(amount) > Number(wallet.balance)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      // Deduct from wallet
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: Number(wallet.balance) - Number(amount) })
        .eq('id', selectedWalletId);

      if (walletError) throw walletError;

      // Create investment plan
      createPlan({
        wallet_id: selectedWalletId,
        plan_type: planType,
        amount: Number(amount),
        apy: defaultApy,
        term_months: Number(termMonths),
      });

      toast.success('Investment plan created successfully!');
      onOpenChange(false);
      setSelectedWalletId('');
      setAmount('');
    } catch (error) {
      console.error('Error creating investment:', error);
      toast.error('Failed to create investment plan');
    }
  };

  const getPlanTitle = () => {
    switch (planType) {
      case 'auto-invest': return 'Create Auto-Invest Plan';
      case 'fixed-term': return 'Create Fixed-Term Plan';
      case 'flexible-earn': return 'Create Flexible Earn Plan';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getPlanTitle()}</DialogTitle>
          <DialogDescription>
            Lock your crypto and earn {defaultApy}% APY
          </DialogDescription>
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

          {planType === 'fixed-term' && (
            <div>
              <Label>Lock Period (Months)</Label>
              <Select value={termMonths} onValueChange={setTermMonths}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month (8% APY)</SelectItem>
                  <SelectItem value="2">2 Months (10% APY)</SelectItem>
                  <SelectItem value="3">3 Months (12% APY)</SelectItem>
                  <SelectItem value="6">6 Months (15% APY)</SelectItem>
                  <SelectItem value="12">12 Months (20% APY)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">APY:</span>
                <span className="font-semibold">{defaultApy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lock Period:</span>
                <span className="font-semibold">
                  {termMonths === '0' ? 'Flexible' : `${termMonths} Month(s)`}
                </span>
              </div>
              {amount && (
                <div className="flex justify-between text-success">
                  <span>Estimated Yearly Return:</span>
                  <span className="font-semibold">
                    {(Number(amount) * defaultApy / 100).toFixed(8)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleCreate} className="w-full">
            Create Investment Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
