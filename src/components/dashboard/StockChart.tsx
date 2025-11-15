// src/components/dashboard/StockChart.tsx

import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Candlestick data type: [timestamp, [open, high, low, close]]
export type CandlestickData = {
    data: [number, number[]][];
}[];

interface StockChartProps {
    title: string;
    data: CandlestickData;
}

const StockChart: React.FC<StockChartProps> = ({ title, data }) => {
    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "candlestick",
            height: 380,
            toolbar: { show: true },
        },
        title: {
            text: title,
            align: "left",
            style: { fontSize: "16px", fontWeight: "bold" },
        },
        xaxis: {
            type: "datetime",
        },
        yaxis: {
            tooltip: {
                enabled: true,
            },
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: "#00B746",
                    downward: "#EF403C",
                },
            },
        },
    };

    return (
        <Card className="shadow-card hover:shadow-glow transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </CardHeader>

            <CardContent>
                <div id="apex-stock-chart">
                    <ReactApexChart
                        options={options}
                        series={data}
                        type="candlestick"
                        height={380}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default StockChart;