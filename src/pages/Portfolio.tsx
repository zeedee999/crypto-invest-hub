import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Wallet } from 'lucide-react';

export default function Portfolio() {
  const { user } = useAuth();

  const { data: wallets, isLoading } = useQuery({
    queryKey: ['wallets', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">Your crypto holdings</p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </CardContent>
          </Card>
        ) : wallets && wallets.length > 0 ? (
          <div className="grid gap-4">
            {wallets.map((wallet) => (
              <Card key={wallet.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    {wallet.asset_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance</span>
                      <span className="font-semibold">{Number(wallet.balance).toFixed(8)} {wallet.asset_symbol}</span>
                    </div>
                    {wallet.wallet_address && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Address</span>
                        <span className="text-sm font-mono">{wallet.wallet_address.slice(0, 8)}...{wallet.wallet_address.slice(-6)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No wallets yet. Start by making a deposit!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}