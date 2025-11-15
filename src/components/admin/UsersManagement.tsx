import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Ban, CheckCircle } from 'lucide-react';

export function UsersManagement() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: balances } = await supabase
        .from('user_balances')
        .select('*');

      return profilesData.map(profile => ({
        ...profile,
        balance: balances?.find(b => b.user_id === profile.id),
      }));
    },
  });

  const toggleSuspension = useMutation({
    mutationFn: async ({ userId, newStatus }: { userId: string; newStatus: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated');
    },
    onError: () => {
      toast.error('Failed to update user status');
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Deposit Balance</TableHead>
          <TableHead>Profit Balance</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.full_name || 'N/A'}</TableCell>
            <TableCell>{user.phone || 'N/A'}</TableCell>
            <TableCell>
              <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>${Number(user.balance?.deposit_balance || 0).toFixed(2)}</TableCell>
            <TableCell>${Number(user.balance?.profit_balance || 0).toFixed(2)}</TableCell>
            <TableCell>
              {user.status === 'active' ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => toggleSuspension.mutate({ userId: user.id, newStatus: 'suspended' })}
                >
                  <Ban className="h-4 w-4 mr-1" />
                  Suspend
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => toggleSuspension.mutate({ userId: user.id, newStatus: 'active' })}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Activate
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
