import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export function WithdrawalsApproval() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ['pending-withdrawals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'withdraw')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const approveWithdrawal = useMutation({
    mutationFn: async (transactionId: string) => {
      const transaction = withdrawals?.find(w => w.id === transactionId);
      if (!transaction) throw new Error('Transaction not found');

      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

      if (error) throw error;

      await supabase.rpc('create_notification', {
        _user_id: transaction.user_id,
        _type: 'withdrawal',
        _title: 'Withdrawal Approved',
        _message: `Your withdrawal of ${transaction.amount} ${transaction.asset_symbol} has been approved.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-withdrawals'] });
      toast.success('Withdrawal approved');
    },
    onError: () => {
      toast.error('Failed to approve withdrawal');
    },
  });

  const rejectWithdrawal = useMutation({
    mutationFn: async (transactionId: string) => {
      const transaction = withdrawals?.find(w => w.id === transactionId);
      if (!transaction) throw new Error('Transaction not found');

      const { error: txError } = await supabase
        .from('transactions')
        .update({ 
          status: 'rejected',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

      if (txError) throw txError;

      // Return funds to user balance
      const { error: balanceError } = await supabase.rpc('increment_deposit_balance', {
        p_user_id: transaction.user_id,
        p_amount: transaction.amount,
      });

      if (balanceError) throw balanceError;

      await supabase.rpc('create_notification', {
        _user_id: transaction.user_id,
        _type: 'withdrawal',
        _title: 'Withdrawal Rejected',
        _message: `Your withdrawal of ${transaction.amount} ${transaction.asset_symbol} has been rejected and funds returned.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-withdrawals'] });
      toast.success('Withdrawal rejected and funds returned');
    },
    onError: () => {
      toast.error('Failed to reject withdrawal');
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>User ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Asset</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {withdrawals?.map((withdrawal) => (
          <TableRow key={withdrawal.id}>
            <TableCell>{format(new Date(withdrawal.created_at!), 'MMM dd, yyyy HH:mm')}</TableCell>
            <TableCell className="font-mono text-xs">{withdrawal.user_id.slice(0, 8)}...</TableCell>
            <TableCell>{Number(withdrawal.amount).toFixed(8)}</TableCell>
            <TableCell>{withdrawal.asset_symbol}</TableCell>
            <TableCell>
              <Badge>{withdrawal.status}</Badge>
            </TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => approveWithdrawal.mutate(withdrawal.id)}
                disabled={approveWithdrawal.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => rejectWithdrawal.mutate(withdrawal.id)}
                disabled={rejectWithdrawal.isPending}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
