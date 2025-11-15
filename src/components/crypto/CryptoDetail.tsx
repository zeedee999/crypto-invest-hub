// src/components/crypto/CryptoDetail.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, BarChart, TrendingUp, TrendingDown, Layers, Hash } from "lucide-react";
import Chart from "react-apexcharts";

// --- UPDATED INTERFACES ---
interface Ticker {
  base: string;
  target: string;
  market: { name: string; identifier: string };
  last: number;
  volume: number;
  bid_ask_spread_percentage: number;
  trust_score: string; // e.g., "high", "low", "untrusted"
}

interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string }; // Coingecko image structure
  description: { en: string }; // Added for description
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number }; // Added
    total_volume: { usd: number }; // Added
    high_24h: { usd: number }; // Added
    low_24h: { usd: number }; // Added
    circulating_supply: number; // Added
    market_cap_rank: number; // Added
  };
  tickers: Ticker[]; // Added for markets/exchanges
}

interface ChartData {
  x: number;
  y: number;
}
// --------------------------

// Reusable component for displaying key metrics
interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}
const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => (
    <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const CryptoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [chartSeries, setChartSeries] = useState<ChartData[]>([]);

  const formatCurrency = (value: number) => 
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: value >= 1000 ? 0 : 2 })}`;

  const fetchCoinData = async () => {
    if (!id) return;
    try {
      // --- IMPORTANT: Change 'tickers=false' to 'tickers=true' to get market data ---
      const res = await fetch(`/api/v3/coins/${id}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`);
      const data: CoinDetail = await res.json();
      setCoin(data);
    } catch (err) {
      console.error("Error fetching coin data:", err);
    }
  };

  const fetchMarketChart = async (days: number = 7) => {
    if (!id) return;
    try {
      // Fetch 7 days of data for a better chart view
      const res = await fetch(`/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
      const data = await res.json();
      const formatted: ChartData[] = data.prices.map((p: [number, number]) => ({ x: p[0], y: p[1] }));
      setChartSeries(formatted);
    } catch (err) {
      console.error("Error fetching market chart:", err);
    }
  };

  useEffect(() => {
    fetchCoinData();
    fetchMarketChart(7); // Fetch 7 days of data
    
    // Set a longer interval for less aggressive fetching, e.g., 5 minutes (300000ms)
    const interval = setInterval(fetchCoinData, 300000); 
    return () => clearInterval(interval);
  }, [id]);

  if (!coin) return <DashboardLayout>Loading...</DashboardLayout>;

  const { market_data, tickers, description } = coin;
  const topTickers = tickers.filter(t => t.trust_score === 'high').slice(0, 5);
  const priceChange = market_data.price_change_percentage_24h;
  const isProfit = priceChange >= 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* --- HEADER SECTION --- */}
        <div className="flex items-center gap-4 border-b pb-4">
          <img src={coin.image.large} alt={coin.name} className="w-12 h-12 rounded-full" />
          <div>
            <h1 className="text-4xl font-extrabold flex items-center gap-3">
              {coin.name} 
              <span className="text-xl font-medium text-muted-foreground">({coin.symbol.toUpperCase()})</span>
            </h1>
            <p className="text-5xl font-bold mt-1">
                {formatCurrency(market_data.current_price.usd)}
                <span className={`ml-4 text-2xl font-semibold flex items-center gap-1 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                    {isProfit ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                    {priceChange.toFixed(2)}% (24h)
                </span>
            </p>
          </div>
        </div>

        {/* --- 24H KEY METRICS GRID --- */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard 
                title="Market Cap Rank" 
                value={`#${market_data.market_cap_rank}`} 
                icon={<Hash className="w-5 h-5 text-muted-foreground" />} 
            />
            <MetricCard 
                title="24h High" 
                value={formatCurrency(market_data.high_24h.usd)} 
                icon={<TrendingUp className="w-5 h-5 text-green-500" />} 
            />
            <MetricCard 
                title="24h Low" 
                value={formatCurrency(market_data.low_24h.usd)} 
                icon={<TrendingDown className="w-5 h-5 text-red-500" />} 
            />
            <MetricCard 
                title="Circulating Supply" 
                value={market_data.circulating_supply.toLocaleString('en-US', { maximumFractionDigits: 0 })} 
                icon={<Layers className="w-5 h-5 text-muted-foreground" />} 
            />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
            {/* --- PRICE CHART (2/3 width) --- */}
            <div className="lg:col-span-2 space-y-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>7-Day Price Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Chart
                          type="area" // Changed to 'area' for a cleaner price trend view
                          height={380}
                          series={[{ name: coin.symbol.toUpperCase(), data: chartSeries }]}
                          options={{
                            chart: { id: "crypto-chart", animations: { enabled: true }, toolbar: { show: true }, zoom: { enabled: true } },
                            xaxis: { type: "datetime" },
                            yaxis: { labels: { formatter: (val) => `$${val.toFixed(2)}` } },
                            stroke: { curve: "smooth", width: 2 },
                            dataLabels: { enabled: false },
                            tooltip: { x: { format: "dd MMM yyyy" } },
                            fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.1 } }
                          }}
                        />
                    </CardContent>
                </Card>

                {/* --- COIN DESCRIPTION --- */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>What is {coin.name}?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div dangerouslySetInnerHTML={{ __html: description.en.split('. ')[0] + '.' }} />
                        <p className="mt-4 text-sm text-muted-foreground">[Description is truncated for brevity. Full text available on external source.]</p>
                    </CardContent>
                </Card>
            </div>


            {/* --- MARKET DATA (1/3 width) --- */}
            <div className="lg:col-span-1 space-y-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5"/> Market Cap & Volume</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Market Capitalization:</span>
                            <span className="font-bold">{formatCurrency(market_data.market_cap.usd)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">24h Trading Volume:</span>
                            <span className="font-bold">{formatCurrency(market_data.total_volume.usd)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* --- TOP MARKETS/EXCHANGES --- */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5"/> Top Trading Pairs (High Trust)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Exchange</TableHead>
                                    <TableHead>Pair</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Volume</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topTickers.length > 0 ? (
                                    topTickers.map((ticker, index) => (
                                        <TableRow key={index} className={ticker.trust_score === 'high' ? '' : 'bg-yellow-50/50'}>
                                            <TableCell className="font-medium">{ticker.market.name}</TableCell>
                                            <TableCell>{ticker.base}/{ticker.target}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(ticker.last)}</TableCell>
                                            <TableCell className="text-right">{ticker.volume.toFixed(0)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No high-trust markets found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CryptoDetail;