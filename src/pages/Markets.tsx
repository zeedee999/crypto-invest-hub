import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const cryptos = [
  { symbol: 'BTC', name: 'Bitcoin', price: 42156.23, change: 2.45, icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', price: 2234.56, change: -1.23, icon: 'Ξ' },
  { symbol: 'USDT', name: 'Tether', price: 1.00, change: 0.01, icon: '₮' },
  { symbol: 'BNB', name: 'Binance Coin', price: 312.45, change: 3.21, icon: 'B' },
  { symbol: 'SOL', name: 'Solana', price: 98.76, change: 5.43, icon: 'S' },
  { symbol: 'XRP', name: 'Ripple', price: 0.61, change: -2.11, icon: 'X' },
  { symbol: 'ADA', name: 'Cardano', price: 0.45, change: 1.87, icon: 'A' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.08, change: 4.56, icon: 'Ð' },
];

export default function Markets() {
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
              {cryptos.map((crypto) => (
                <div
                  key={crypto.symbol}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      {crypto.icon}
                    </div>
                    <div>
                      <p className="font-semibold">{crypto.name}</p>
                      <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${crypto.price.toLocaleString()}</p>
                    <div className={`flex items-center gap-1 text-sm ${crypto.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {crypto.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {Math.abs(crypto.change)}%
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