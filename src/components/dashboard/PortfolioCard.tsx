import { TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// Real-time price type
interface FinnhubTrade {
  p: number; // price
  s: string; // symbol
  t: number; // timestamp
  v: number; // volume
  c: string[];
}

interface FinnhubWSMessage {
  type: "trade" | string;
  data?: FinnhubTrade[];
}

// Replace with your actual API key
const FINNHUB_API_KEY = "d4c5phhr01qoua32kvp0d4c5phhr01qoua32kvpg";
const SYMBOL = "BINANCE:BTCUSDT";

const PortfolioCard: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [btcPrice, setBtcPrice] = useState(0);

  // Mock portfolio holding
  const btcHolding = 1.5; // e.g., 1.5 BTC

  // Real-time total balance
  const totalBalance = btcPrice * btcHolding;
  const profitLoss = totalBalance - 100000; // e.g., initial investment 100k
  const profitLossPercent = (profitLoss / 100000) * 100;
  const isProfit = profitLoss > 0;

  // WebSocket to get real-time BTC price
  useEffect(() => {
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", symbol: SYMBOL }));
    };

    ws.onmessage = (event: MessageEvent) => {
      const message: FinnhubWSMessage = JSON.parse(event.data);
      if (message.type === "trade" && message.data && message.data.length > 0) {
        setBtcPrice(message.data[0].p); // latest price
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "unsubscribe", symbol: SYMBOL }));
      }
      ws.close();
    };
  }, []);

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
              {Math.abs(profitLoss).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </span>
            <span className="text-muted-foreground">24h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;