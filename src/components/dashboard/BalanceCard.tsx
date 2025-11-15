// src/components/dashboard/BalanceCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, Gift } from "lucide-react";
import { ReactNode } from "react";

// Placeholder component for the sparkline chart
// In a real application, you would replace this with your actual ApexCharts component
const ApexChartsSparklinePlaceholder = ({ id }: { id: string }) => (
  <div id={id} className="h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-muted-foreground">
    [Sparkline Chart: {id}]
  </div>
);

interface BalanceCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  chartId: string;
  chartData: any; // In a real app, define a proper type for chart data
}

const BalanceCard = ({ title, value, icon, chartId, chartData }: BalanceCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-glow transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold">
          {`$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </div>
        <ApexChartsSparklinePlaceholder id={chartId} />
      </CardContent>
    </Card>
  );
};

export default BalanceCard;