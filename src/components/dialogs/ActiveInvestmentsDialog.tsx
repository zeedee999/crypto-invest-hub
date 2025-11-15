import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, LockOpen } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ActiveInvestmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planType: string;
  productName: string;
}

export function ActiveInvestmentsDialog({ open, onOpenChange, planType, productName }: ActiveInvestmentsDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: investments, isLoading } = useQuery({
    queryKey: ['active-investments', user?.id, planType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('user_id', user?.id)
        .eq('plan_type', planType)
        .in('status', ['active', 'locked'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Fetch wallet info separately
      const investmentsWithWallets = await Promise.all(
        data.map(async (investment) => {
          const { data: wallet } = await supabase
            .from('wallets')
            .select('asset_symbol, asset_name')
            .eq('id', investment.wallet_id)
            .single();
          
          return { ...investment, wallet };
        })
      );
      
      return investmentsWithWallets;
    },
    enabled: !!user && open,
  });

  const withdrawMutation = useMutation({
    mutationFn: async (investmentId: string) => {
      const investment = investments?.find(inv => inv.id === investmentId);
      if (!investment) throw new Error('Investment not found');

      // Check if investment can be withdrawn
      if (investment.status === 'locked' && investment.unlock_date) {
        const unlockDate = new Date(investment.unlock_date);
        if (unlockDate > new Date()) {
          throw new Error('Investment is still locked');
        }
      }

      // Update investment status to completed
      const { error: updateError } = await supabase
        .from('investment_plans')
        .update({ status: 'completed' })
        .eq('id', investmentId);

      if (updateError) throw updateError;

      // Return funds to wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', investment.wallet_id)
        .single();

      if (wallet) {
        const newBalance = Number(wallet.balance) + Number(investment.current_value);
        const { error: walletError } = await supabase
          .from('wallets')
          .update({ balance: newBalance })
          .eq('id', investment.wallet_id);

        if (walletError) throw walletError;
      }

      return investment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-investments'] });
      queryClient.invalidateQueries({ queryKey: ['investment-plans'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast.success('Investment withdrawn to wallet successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to withdraw investment');
    },
  });

  const canWithdraw = (investment: any) => {
    if (investment.status === 'active') return true;
    if (investment.status === 'locked' && investment.unlock_date) {
      return new Date(investment.unlock_date) <= new Date();
    }
    return false;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{productName} - Active Investments</DialogTitle>
          <DialogDescription>
            View and manage your active investments
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
          ) : investments && investments.length > 0 ? (
            investments.map((investment) => (
              <div
                key={investment.id}
                className="p-4 rounded-lg border border-border bg-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {investment.wallet?.asset_symbol || 'N/A'}
                      </span>
                      <Badge variant={investment.status === 'locked' ? 'secondary' : 'default'}>
                        {investment.status === 'locked' ? (
                          <><Lock className="h-3 w-3 mr-1" /> Locked</>
                        ) : (
                          <><LockOpen className="h-3 w-3 mr-1" /> Active</>
                        )}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Started: {formatDate(investment.start_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-success">
                      ${Number(investment.current_value).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Initial: ${Number(investment.amount).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">APY</p>
                    <p className="font-semibold">{investment.apy}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Term</p>
                    <p className="font-semibold">
                      {investment.term_months > 0 ? `${investment.term_months} months` : 'Flexible'}
                    </p>
                  </div>
                  {investment.unlock_date && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Unlock Date</p>
                      <p className="font-semibold">{formatDate(investment.unlock_date)}</p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => withdrawMutation.mutate(investment.id)}
                  disabled={!canWithdraw(investment) || withdrawMutation.isPending}
                >
                  {withdrawMutation.isPending
                    ? 'Processing...'
                    : canWithdraw(investment)
                    ? 'Withdraw to Wallet'
                    : `Locked until ${investment.unlock_date ? formatDate(investment.unlock_date) : 'N/A'}`}
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No active investments for this product
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
