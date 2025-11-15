import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const marketData = [
  { symbol: "BTC", name: "Bitcoin", price: 43250.85, change: 3.42, volume: "28.5B" },
  { symbol: "ETH", name: "Ethereum", price: 2284.32, change: 2.18, volume: "15.2B" },
  { symbol: "USDT", name: "Tether", price: 1.00, change: 0.01, volume: "45.8B" },
  { symbol: "BNB", name: "BNB", price: 315.47, change: -1.23, volume: "2.1B" },
];

const MarketOverview = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.map((coin) => {
            const isPositive = coin.change > 0;
            return (
              <div
                key={coin.symbol}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{coin.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{coin.symbol}</p>
                    <p className="text-xs text-muted-foreground">{coin.name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{isPositive ? '+' : ''}{coin.change}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
