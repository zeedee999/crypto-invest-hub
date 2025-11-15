import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

interface Crypto {
  id: string;           // CoinGecko ID
  symbol: string;
  name: string;
  price: number;
  change: number;
  image?: string;       // Coin logo URL
}

const initialCryptos: Crypto[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 0, change: 0 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 0, change: 0 },
  { id: 'tether', symbol: 'USDT', name: 'Tether', price: 0, change: 0 },
  { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin', price: 0, change: 0 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 0, change: 0 },
  { id: 'ripple', symbol: 'XRP', name: 'Ripple', price: 0, change: 0 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0, change: 0 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0, change: 0 },
];

export default function Markets() {
  const [cryptos, setCryptos] = useState<Crypto[]>(initialCryptos);
  const navigate = useNavigate();
  const { isAdmin, isLoading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!roleLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, roleLoading, navigate]);

  const fetchPrices = async () => {
    try {
      const ids = cryptos.map(c => c.id).join(',');
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`);
      const data = await res.json();

      const updated = cryptos.map(c => {
        const coinData = data.find((d: any) => d.id === c.id);
        return {
          ...c,
          price: coinData?.current_price || 0,
          change: coinData?.price_change_percentage_24h || 0,
          image: coinData?.image || '',
        };
      });

      setCryptos(updated);
    } catch (err) {
      console.error('Error fetching crypto prices:', err);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  const handleClick = (id: string) => {
    navigate(`/crypto/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Markets</h1>
          <p className="text-muted-foreground">Live cryptocurrency prices</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Cryptocurrencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cryptos.map(crypto => (
                <div
                  key={crypto.symbol}
                  onClick={() => handleClick(crypto.id)}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {crypto.image ? (
                        <img src={crypto.image} alt={crypto.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-2xl">{crypto.symbol}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{crypto.name}</p>
                      <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className={`flex items-center gap-1 text-sm ${crypto.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {crypto.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {crypto.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}