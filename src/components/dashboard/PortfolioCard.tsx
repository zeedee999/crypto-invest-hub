import { TrendingUp, TrendingDown, Eye, EyeOff, Bitcoin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserBalance } from "@/hooks/useUserBalance";

const PortfolioCard: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [btcPrice, setBtcPrice] = useState(96000); // Default fallback
  const { user } = useAuth();
  const { balance } = useUserBalance();

  // Fetch real-time BTC price
  useEffect(() => {
    const ws = new WebSocket('wss://ws.finnhub.io?token=d4c5phhr01qoua32kvp0d4c5phhr01qoua32kvpg');
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'subscribe', symbol: 'BINANCE:BTCUSDT' }));
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'trade' && message.data && message.data.length > 0) {
        setBtcPrice(message.data[0].p);
      }
    };
    
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'unsubscribe', symbol: 'BINANCE:BTCUSDT' }));
      }
      ws.close();
    };
  }, []);

  // Fetch all wallets
  const { data: wallets } = useQuery({
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

  // Fetch investment plans
  const { data: investmentPlans } = useQuery({
    queryKey: ['investment-plans', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('user_id', user?.id)
        .in('status', ['active', 'locked']);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Mock crypto prices (in production, fetch from API)
  const cryptoPrices: Record<string, number> = {
    BTC: 96000,
    ETH: 3180,
    USDT: 1,
    BNB: 936,
  };

  // Calculate total portfolio value from wallets
  const walletsValue = wallets?.reduce((total, wallet) => {
    const price = cryptoPrices[wallet.asset_symbol] || 0;
    return total + (Number(wallet.balance) * price);
  }, 0) || 0;

  // Calculate total value in investment plans
  const investmentValue = investmentPlans?.reduce((total, plan) => {
    return total + Number(plan.current_value);
  }, 0) || 0;

  // Total portfolio = only wallets (uninvested money)
  const totalBalance = walletsValue;

  // Calculate Bitcoin equivalent
  const btcEquivalent = totalBalance / btcPrice;

  // Calculate profit (profit_balance from user_balances)
  const profitBalance = balance ? Number(balance.profit_balance) : 0;
  const initialInvestment = totalBalance - profitBalance;
  const profitLossPercent = initialInvestment > 0 ? (profitBalance / initialInvestment) * 100 : 0;
  const isProfit = profitBalance > 0;

  return (
    <Card className="shadow-card hover:shadow-glow transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Portfolio Value
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowBalance(!showBalance)}
        >
          {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-3xl font-bold">
              {showBalance
                ? `$${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "••••••••"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Bitcoin className="h-4 w-4 text-orange-500" />
              <p className="text-sm text-muted-foreground">
                {showBalance
                  ? `≈ ${btcEquivalent.toFixed(8)} BTC`
                  : "••••••••"}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              isProfit ? "text-success" : "text-destructive"
            }`}
          >
            {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>
              {isProfit ? "+" : ""}
              {profitLossPercent.toFixed(2)}% ($
              {Math.abs(profitBalance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </span>
            <span className="text-muted-foreground">Daily Gain</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;