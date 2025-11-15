// components/dashboard/BalanceCard.tsx
import React from "react";

export interface BalanceCardProps {
    title: string;
    value: number;
    icon?: React.ReactNode;
    chartId?: string;
    chartData?: number[];
}

const BalanceCard: React.FC<BalanceCardProps> = ({
    title,
    value,
    icon,
    chartId,
    chartData = [],
}) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-gray-600 text-sm font-medium">{title}</h2>
                {icon}
            </div>

            <p className="text-3xl font-bold mt-2">
                ${value.toLocaleString()}
            </p>

            {chartId && (
                <div id={chartId} className="mt-4 h-12 w-full">
                    {/* Sparkline placeholder */}
                </div>
            )}
        </div>
    );
};

export default BalanceCard;