import { Lock, TrendingUp, Bitcoin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const InvestmentBalanceCard: React.FC = () => {
  const { user } = useAuth();
  const [btcPrice, setBtcPrice] = useState(96000);

  // Real-time BTC price
  useEffect(() => {
    const ws = new WebSocket(
      "wss://ws.finnhub.io?token=d4c5phhr01qoua32kvp0d4c5phhr01qoua32kvpg"
    );

    ws.onopen = () => {
      ws.send(
        JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" })
      );
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "trade" && message.data && message.data.length > 0) {
        setBtcPrice(message.data[0].p);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({ type: "unsubscribe", symbol: "BINANCE:BTCUSDT" })
        );
      }
      ws.close();
    };
  }, []);

  // Crypto prices
  const cryptoPrices: Record<string, number> = {
    BTC: btcPrice,
    ETH: 3180,
    USDT: 1,
    BNB: 936,
  };

  const { data: investmentPlans } = useQuery({
    queryKey: ['investment-plans-dashboard', user?.id],
    queryFn: async () => {
      const { data: plans, error: plansError } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('user_id', user?.id)
        .in('status', ['active', 'locked']);
      
      if (plansError) throw plansError;

      const { data: wallets, error: walletsError } = await supabase
        .from('wallets')
        .select('id, asset_symbol, asset_name')
        .eq('user_id', user?.id);
      
      if (walletsError) throw walletsError;

      // Join wallets data with plans
      const plansWithWallets = plans?.map(plan => ({
        ...plan,
        wallet: wallets?.find(w => w.id === plan.wallet_id)
      }));

      return plansWithWallets;
    },
    enabled: !!user,
  });

  const totalInvested = investmentPlans?.reduce((sum, plan) => sum + Number(plan.current_value), 0) || 0;

  return (
    <Card className="shadow-card hover:shadow-glow transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Investment Balance
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold">
              ${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total value across {investmentPlans?.length || 0} investments
            </p>
          </div>

          {investmentPlans && investmentPlans.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Active Investments</p>
              {investmentPlans.slice(0, 3).map((plan) => {
                const assetSymbol = (plan as any).wallet?.asset_symbol || 'USDT';
                const price = cryptoPrices[assetSymbol] || 1;
                const cryptoAmount = Number(plan.current_value) / price;
                const valueUSD = Number(plan.current_value);

                return (
                  <div key={plan.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      {plan.status === 'locked' && (
                        <Lock className="h-3 w-3 text-primary" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {assetSymbol} {plan.plan_type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {plan.apy}% APY
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {cryptoAmount.toFixed(assetSymbol === 'BTC' ? 8 : 4)} {assetSymbol}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ≈ ${valueUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <Badge variant={plan.status === 'locked' ? 'default' : 'secondary'} className="text-xs mt-1">
                        {plan.status === 'locked' ? 'Locked' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {investmentPlans.length > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  +{investmentPlans.length - 3} more investments
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentBalanceCard;
