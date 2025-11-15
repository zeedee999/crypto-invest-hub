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

// Import the candlestick type
import { CandlestickData } from "@/components/dashboard/StockChart";

// ---- Finnhub WebSocket Types ----
interface FinnhubTrade {
    p: number;      // price
    s: string;      // symbol
    t: number;      // timestamp
    v: number;      // volume
    c: string[];    // trade conditions
}

interface FinnhubWSMessage {
    type: "trade" | string;
    data?: FinnhubTrade[];
}

// ---- Constants ----
const FINNHUB_API_KEY = "d4c5phhr01qoua32kvp0d4c5phhr01qoua32kvpg";
const CHART_SYMBOL = "BINANCE:BTCUSDT";

// ---- Candlestick Update Logic ----
const processFinnhubQuote = (
    message: FinnhubWSMessage,
    currentCandles: CandlestickData
): CandlestickData => {

    if (message.type !== "trade" || !message.data || message.data.length === 0) {
        return currentCandles;
    }

    const trades = message.data;
    const now = Date.now();
    const currentMinute = Math.floor(now / 60000) * 60000;
    const latestPrice = trades[0].p;

    const latestCandles = currentCandles[0]?.data || [];
    const lastCandle = latestCandles[latestCandles.length - 1];

    // Update candle within the same minute
    if (lastCandle && lastCandle[0] === currentMinute) {
        const [timestamp, [open, high, low, close]] = lastCandle;

        const updatedHigh = Math.max(high, latestPrice);
        const updatedLow = Math.min(low, latestPrice);

        const updatedCandle: [number, number[]] = [
            timestamp,
            [open, updatedHigh, updatedLow, latestPrice]
        ];

        return [{ data: [...latestCandles.slice(0, -1), updatedCandle] }];
    }

    // Create new candle
    const newCandle: [number, number[]] = [
        currentMinute,
        [latestPrice, latestPrice, latestPrice, latestPrice]
    ];

    return [{ data: [...latestCandles, newCandle].slice(-100) }];
};

const Index: React.FC = () => {
    // Candlestick chart state
    const [chartData, setChartData] = useState<CandlestickData>([{ data: [] }]);

    // WebSocket - Live BTC/USDT Prices
    useEffect(() => {
        if (!FINNHUB_API_KEY) {
            console.error("Missing Finnhub API key.");
            return;
        }

        const ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

        ws.onopen = () => {
            console.log("Finnhub WebSocket Connected");
            ws.send(JSON.stringify({ type: "subscribe", symbol: CHART_SYMBOL }));
        };

        ws.onmessage = (event: MessageEvent) => {
            const message: FinnhubWSMessage = JSON.parse(event.data);
            if (message.type === "trade") {
                setChartData((prev) => processFinnhubQuote(message, prev));
            }
        };

        ws.onerror = (err) => console.error("Finnhub WebSocket Error:", err);
        ws.onclose = () => console.log("Finnhub WebSocket Closed");

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "unsubscribe", symbol: CHART_SYMBOL }));
            }
            ws.close();
        };
    }, []);

    // Dashboard Data
    const depositBalance = 95000;
    const profitBalance = 12847.32;
    const totalBonus = 5000;

    // Small sparkline charts
    const sparkline1Data: number[] = [];
    const sparkline2Data: number[] = [];
    const sparkline3Data: number[] = [];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here’s your overview.
                    </p>
                </div>

                {/* Balance Summary */}
                <div className="grid gap-6 md:grid-cols-3">
                    <BalanceCard
                        title="Deposit Balance"
                        value={depositBalance}
                        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                        chartId="analytic-sparkline-1"
                        chartData={sparkline1Data}
                    />

                    <BalanceCard
                        title="Profit Balance"
                        value={profitBalance}
                        icon={<Percent className="h-4 w-4 text-muted-foreground" />}
                        chartId="analytic-sparkline-2"
                        chartData={sparkline2Data}
                    />

                    <BalanceCard
                        title="Total Bonus"
                        value={totalBonus}
                        icon={<Gift className="h-4 w-4 text-muted-foreground" />}
                        chartId="analytic-sparkline-3"
                        chartData={sparkline3Data}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <PortfolioCard />
                        <QuickActions />

                        {/* Real-Time BTC/USDT Chart */}
                        <StockChart
                            title="BTC/USDT Live Chart"
                            data={chartData}
                        />

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