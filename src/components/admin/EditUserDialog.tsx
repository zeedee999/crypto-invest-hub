import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EditUserDialogProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState(user.full_name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [depositBalance, setDepositBalance] = useState(user.balance?.deposit_balance || 0);
  const [profitBalance, setProfitBalance] = useState(user.balance?.profit_balance || 0);

  const updateUser = useMutation({
    mutationFn: async () => {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone })
        .eq('id', user.id);

      if (profileError) throw profileError;

      const { error: balanceError } = await supabase
        .from('user_balances')
        .update({ 
          deposit_balance: Number(depositBalance), 
          profit_balance: Number(profitBalance) 
        })
        .eq('user_id', user.id);

      if (balanceError) throw balanceError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated successfully');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone/Email</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="depositBalance">Deposit Balance</Label>
            <Input
              id="depositBalance"
              type="number"
              step="0.01"
              value={depositBalance}
              onChange={(e) => setDepositBalance(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="profitBalance">Profit Balance</Label>
            <Input
              id="profitBalance"
              type="number"
              step="0.01"
              value={profitBalance}
              onChange={(e) => setProfitBalance(e.target.value)}
            />
          </div>
          <Button
            onClick={() => updateUser.mutate()}
            disabled={updateUser.isPending}
            className="w-full"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
