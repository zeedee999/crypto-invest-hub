import { RefreshCw, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DepositDialog } from "@/components/dialogs/DepositDialog";
import { WithdrawDialog } from "@/components/dialogs/WithdrawDialog";
import { Button } from "@/components/ui/button";

const QuickActions = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <DepositDialog />
          <WithdrawDialog />
          <Button variant="outline" className="h-auto flex-col gap-2 py-4">
            <Send className="h-5 w-5" />
            <span className="text-sm">Send</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4">
            <RefreshCw className="h-5 w-5" />
            <span className="text-sm">Swap</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
