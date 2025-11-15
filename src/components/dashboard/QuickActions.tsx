// src/components/dashboard/QuickActions.tsx
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DepositDialog } from "../dialogs/DepositDialog";
import { WithdrawDialog } from "../dialogs/WithdrawDialog";
import { SwapDialog } from "../dialogs/SwapDialog";
import { SendCoinDialog } from "../dialogs/SendCoinDialog";

const QuickActions = () => {
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="flex-1 h-24 flex flex-col gap-2"
            onClick={() => setDepositOpen(true)}
          >
            <ArrowDownLeft className="h-6 w-6" />
            <span>Deposit</span>
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-24 flex flex-col gap-2"
            onClick={() => setWithdrawOpen(true)}
          >
            <ArrowUpRight className="h-6 w-6" />
            <span>Withdraw</span>
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-24 flex flex-col gap-2"
            onClick={() => setSwapOpen(true)}
          >
            <RefreshCw className="h-6 w-6" />
            <span>Swap</span>
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-24 flex flex-col gap-2"
            onClick={() => setSendOpen(true)}
          >
            <Send className="h-6 w-6" />
            <span>Send</span>
          </Button>
        </div>

        <DepositDialog open={depositOpen} onOpenChange={setDepositOpen} />
        <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
        <SwapDialog open={swapOpen} onOpenChange={setSwapOpen} />
        <SendCoinDialog open={sendOpen} onOpenChange={setSendOpen} />
      </CardContent>
    </Card>
  );
};

export default QuickActions;
