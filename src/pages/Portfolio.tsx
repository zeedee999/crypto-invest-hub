import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Wallet, Lock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useEffect } from 'react';

export default function Portfolio() {
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roleLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, roleLoading, navigate]);

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

  const { data: investmentPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['investment-plans', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_plans')
        .select(`
          *,
          wallets:wallet_id (
            asset_symbol,
            asset_name
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
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

        {isLoading || plansLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Wallets Section */}
            {wallets && wallets.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Wallets</h2>
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
              </div>
            )}

            {/* Investment Plans Section */}
            {investmentPlans && investmentPlans.length > 0 && (
              <div className="space-y-4 mt-8">
                <h2 className="text-xl font-semibold">Investment Plans</h2>
                <div className="grid gap-4">
                  {investmentPlans.map((plan: any) => {
                    const isLocked = plan.status === 'locked';
                    const unlockDate = plan.unlock_date ? new Date(plan.unlock_date) : null;
                    const isUnlocked = unlockDate && unlockDate <= new Date();
                    
                    return (
                      <Card key={plan.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              {isLocked ? <Lock className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                              {plan.plan_type.replace('-', ' ').toUpperCase()}
                            </CardTitle>
                            <Badge variant={isLocked ? 'destructive' : 'default'}>
                              {plan.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Asset</span>
                              <span className="font-semibold">{plan.wallets?.asset_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Initial Amount</span>
                              <span className="font-semibold">{Number(plan.amount).toFixed(8)} {plan.wallets?.asset_symbol}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Current Value</span>
                              <span className="font-semibold text-success">
                                {Number(plan.current_value).toFixed(8)} {plan.wallets?.asset_symbol}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">APY</span>
                              <span className="font-semibold">{plan.apy}%</span>
                            </div>
                            {unlockDate && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {isUnlocked ? 'Unlocked On' : 'Unlocks On'}
                                </span>
                                <span className={`font-semibold ${isUnlocked ? 'text-success' : ''}`}>
                                  {format(unlockDate, 'MMM dd, yyyy')}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!wallets || wallets.length === 0) && (!investmentPlans || investmentPlans.length === 0) && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No wallets or investment plans yet. Start by making a deposit!</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}