// src/pages/Index.tsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PortfolioCard from "@/components/dashboard/PortfolioCard";
import BalanceCard from "@/components/dashboard/BalanceCard";
import StockChart from "@/components/dashboard/StockChart";
import MarketOverview from "@/components/dashboard/MarketOverview";
import InvestmentProducts from "@/components/dashboard/InvestmentProducts";
import QuickActions from "@/components/dashboard/QuickActions";
import { DollarSign, Percent, Gift } from "lucide-react";
import { CandlestickData } from "@/components/dashboard/StockChart";

// ---- Finnhub WS types ----
interface FinnhubTrade {
  p: number;
  s: string;
  t: number;
  v: number;
  c: string[];
}
interface FinnhubWSMessage {
  type: "trade" | string;
  data?: FinnhubTrade[];
}

const FINNHUB_API_KEY = "d4c5phhr01qoua32kvp0d4c5phhr01qoua32kvpg";
const CHART_SYMBOL = "BINANCE:BTCUSDT";

const processFinnhubQuote = (
  message: FinnhubWSMessage,
  currentCandles: CandlestickData
): CandlestickData => {
  if (!message.data || message.data.length === 0 || message.type !== "trade") {
    return currentCandles;
  }
  const trades = message.data;
  const now = Date.now();
  const currentMinute = Math.floor(now / 60000) * 60000;
  const latestPrice = trades[0].p;

  const latestCandles = currentCandles[0]?.data || [];
  const lastCandle = latestCandles[latestCandles.length - 1];

  if (lastCandle && lastCandle[0] === currentMinute) {
    const [timestamp, [open, high, low, close]] = lastCandle;
    const updatedHigh = Math.max(high, latestPrice);
    const updatedLow = Math.min(low, latestPrice);
    const updatedCandle: [number, number[]] = [
      timestamp,
      [open, updatedHigh, updatedLow, latestPrice],
    ];
    return [{ data: [...latestCandles.slice(0, -1), updatedCandle] }];
  }

  const newCandle: [number, number[]] = [
    currentMinute,
    [latestPrice, latestPrice, latestPrice, latestPrice],
  ];

  return [{ data: [...latestCandles, newCandle].slice(-100) }];
};

const Index: React.FC = () => {
  const [chartData, setChartData] = useState<CandlestickData>([{ data: [] }]);

  useEffect(() => {
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

    ws.onopen = () => {
      console.log("Finnhub WS connected");
      ws.send(JSON.stringify({ type: "subscribe", symbol: CHART_SYMBOL }));
    };

    ws.onmessage = (event: MessageEvent) => {
      const message: FinnhubWSMessage = JSON.parse(event.data);
      if (message.type === "trade") {
        setChartData((prev) => processFinnhubQuote(message, prev));
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "unsubscribe", symbol: CHART_SYMBOL }));
      }
      ws.close();
    };
  }, []);

  // Dashboard Values
  const depositBalance = 95000;
  const profitBalance = 12847.32;
  const totalBonus = 5000;

  // Sparkline mock data
  const sparkline1 = Array.from({ length: 20 }, () =>
    Math.floor(Math.random() * 10000)
  );
  const sparkline2 = Array.from({ length: 20 }, () =>
    Math.floor(Math.random() * 5000)
  );
  const sparkline3 = Array.from({ length: 20 }, () =>
    Math.floor(Math.random() * 2000)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here’s your overview.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <BalanceCard
            title="Deposit Balance"
            value={depositBalance}
            icon={<DollarSign className="h-4 w-4 text-white" />}
            chartData={sparkline1}
            bgColor="bg-green-500"
            textColor="text-white"
          />
          <BalanceCard
            title="Profit Balance"
            value={profitBalance}
            icon={<Percent className="h-4 w-4 text-white" />}
            chartData={sparkline2}
            bgColor="bg-red-500"
            textColor="text-white"
          />
          <BalanceCard
            title="Total Bonus"
            value={totalBonus}
            icon={<Gift className="h-4 w-4 text-white" />}
            chartData={sparkline3}
            bgColor="bg-blue-500"
            textColor="text-white"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <PortfolioCard />
            <QuickActions />
            <StockChart title="BTC/USDT Live Chart" data={chartData} />
            <InvestmentProducts />
          </div>

          <div className="space-y-6">
            <MarketOverview />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;