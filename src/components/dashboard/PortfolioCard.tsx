import { TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserBalance } from "@/hooks/useUserBalance";

const PortfolioCard: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const { user } = useAuth();
  const { balance } = useUserBalance();

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

  // Add deposit balance to total
  const depositBalance = balance ? Number(balance.deposit_balance) : 0;

  // Total portfolio = wallets + investments + deposit balance
  const totalBalance = walletsValue + investmentValue + depositBalance;

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
            <span className="text-muted-foreground">24h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;