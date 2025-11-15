import { ArrowUpRight, ArrowDownRight, RefreshCw, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const quickActions = [
  { icon: ArrowDownRight, label: "Buy Crypto", variant: "default" as const, color: "primary" },
  { icon: ArrowUpRight, label: "Sell Crypto", variant: "outline" as const, color: "default" },
  { icon: Send, label: "Send", variant: "outline" as const, color: "default" },
  { icon: RefreshCw, label: "Swap", variant: "outline" as const, color: "default" },
];

const QuickActions = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant={action.variant}
                className="h-auto flex-col gap-2 py-4"
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
