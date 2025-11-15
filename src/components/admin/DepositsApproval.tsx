import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export function DepositsApproval() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: deposits, isLoading } = useQuery({
    queryKey: ['pending-deposits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'deposit')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const approveDeposit = useMutation({
    mutationFn: async (transactionId: string) => {
      const transaction = deposits?.find(d => d.id === transactionId);
      if (!transaction) throw new Error('Transaction not found');

      // Update transaction status
      const { error: txError } = await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

      if (txError) throw txError;

      // Find or create user's wallet for this asset
      let { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', transaction.user_id)
        .eq('asset_symbol', transaction.asset_symbol)
        .single();

      if (!wallet) {
        // Create wallet if it doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({
            user_id: transaction.user_id,
            asset_symbol: transaction.asset_symbol,
            asset_name: transaction.asset_symbol, // You can improve this
            balance: transaction.amount,
          })
          .select()
          .single();

        if (createError) throw createError;
      } else {
        // Update existing wallet balance
        const { error: walletError } = await supabase
          .from('wallets')
          .update({ 
            balance: Number(wallet.balance) + transaction.amount 
          })
          .eq('id', wallet.id);

        if (walletError) throw walletError;
      }

      // Create notification
      await supabase.rpc('create_notification', {
        _user_id: transaction.user_id,
        _type: 'deposit',
        _title: 'Deposit Approved',
        _message: `Your deposit of ${transaction.amount} ${transaction.asset_symbol} has been approved.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-deposits'] });
      toast.success('Deposit approved');
    },
    onError: () => {
      toast.error('Failed to approve deposit');
    },
  });

  const rejectDeposit = useMutation({
    mutationFn: async (transactionId: string) => {
      const transaction = deposits?.find(d => d.id === transactionId);
      if (!transaction) throw new Error('Transaction not found');

      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'rejected',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

      if (error) throw error;

      await supabase.rpc('create_notification', {
        _user_id: transaction.user_id,
        _type: 'deposit',
        _title: 'Deposit Rejected',
        _message: `Your deposit of ${transaction.amount} ${transaction.asset_symbol} has been rejected.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-deposits'] });
      toast.success('Deposit rejected');
    },
    onError: () => {
      toast.error('Failed to reject deposit');
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
        {deposits?.map((deposit) => (
          <TableRow key={deposit.id}>
            <TableCell>{format(new Date(deposit.created_at!), 'MMM dd, yyyy HH:mm')}</TableCell>
            <TableCell className="font-mono text-xs">{deposit.user_id.slice(0, 8)}...</TableCell>
            <TableCell>{Number(deposit.amount).toFixed(8)}</TableCell>
            <TableCell>{deposit.asset_symbol}</TableCell>
            <TableCell>
              <Badge>{deposit.status}</Badge>
            </TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => approveDeposit.mutate(deposit.id)}
                disabled={approveDeposit.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => rejectDeposit.mutate(deposit.id)}
                disabled={rejectDeposit.isPending}
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
