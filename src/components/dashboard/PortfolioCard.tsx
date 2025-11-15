import { TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const PortfolioCard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const totalBalance = 125847.32;
  const profitLoss = 12847.32;
  const profitLossPercent = 11.37;
  const isProfit = profitLoss > 0;

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
          {showBalance ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-3xl font-bold">
              {showBalance ? (
                `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              ) : (
                "••••••••"
              )}
            </p>
          </div>
          <div className={`flex items-center gap-2 text-sm font-medium ${isProfit ? 'text-success' : 'text-destructive'}`}>
            {isProfit ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>
              {isProfit ? '+' : ''}{profitLossPercent}% (${Math.abs(profitLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </span>
            <span className="text-muted-foreground">24h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;
