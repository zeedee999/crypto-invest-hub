// src/components/dashboard/BalanceCard.tsx
import React from "react";
import ReactApexChart from "react-apexcharts";

export interface BalanceCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  chartData?: number[];
  bgColor?: string; // Tailwind bg color
  textColor?: string; // Tailwind text color
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  value,
  icon,
  chartData = [],
  bgColor = "bg-white",
  textColor = "text-gray-600",
}) => {
  // ApexCharts options for sparkline
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "line" as const,
      sparkline: { enabled: true },
    },
    stroke: { curve: "smooth" as const, width: 2 },
    tooltip: { enabled: false },
  };

  const series = [{ data: chartData }];

  return (
    <div
      className={`${bgColor} shadow-md rounded-2xl p-5 flex flex-col transition-transform transform hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-sm font-medium ${textColor}`}>{title}</h2>
        {icon}
      </div>

      <p className={`text-3xl font-bold mt-2 ${textColor}`}>
        ${value.toLocaleString()}
      </p>

      {chartData && chartData.length > 0 && (
        <div className="mt-4 h-12 w-full">
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="line"
            height={50}
          />
        </div>
      )}
    </div>
  );
};

export default BalanceCard;