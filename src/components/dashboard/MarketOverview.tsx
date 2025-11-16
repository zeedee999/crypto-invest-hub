import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Crypto {
  id: string;           // CoinGecko ID
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume?: string;
  image?: string;       // Coin logo URL
}

const initialData: Crypto[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 0, change: 0, volume: "28.5B" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 0, change: 0, volume: "15.2B" },
  { id: "tether", symbol: "USDT", name: "Tether", price: 0, change: 0, volume: "45.8B" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", price: 0, change: 0, volume: "2.1B" },
];

const MarketOverview: React.FC = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>(initialData);
  const navigate = useNavigate();

  const fetchMarketData = async () => {
    try {
      const ids = cryptos.map(c => c.id).join(",");
      const res = await fetch(
        `/api/v3/coins/markets?vs_currency=usd&ids=${ids}`
      );
      const data = await res.json();

      const updated = cryptos.map(c => {
        const coinData = data.find((d: any) => d.id === c.id);
        return {
          ...c,
          price: coinData?.current_price || 0,
          change: coinData?.price_change_percentage_24h || 0,
          image: coinData?.image || "",
        };
      });

      setCryptos(updated);
    } catch (err) {
      console.error("Error fetching market data:", err);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  const handleClick = (id: string) => {
    navigate(`/crypto/${id}`);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cryptos.map((coin) => {
            const isPositive = coin.change > 0;
            return (
              <div
                key={coin.symbol}
                onClick={() => handleClick(coin.id)}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {coin.image ? (
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 object-contain" />
                    ) : (
                      <span className="text-sm font-bold text-primary">{coin.symbol.slice(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{coin.symbol}</p>
                    <p className="text-xs text-muted-foreground">{coin.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ${coin.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      isPositive ? "text-success" : "text-destructive"
                    }`}
                  >
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{isPositive ? "+" : ""}{coin.change.toFixed(2)}%</span>
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