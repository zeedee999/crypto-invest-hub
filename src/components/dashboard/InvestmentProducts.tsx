import { useState } from "react";
import { Lock, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InvestmentPlanDialog } from "@/components/dialogs/InvestmentPlanDialog";

const investmentProducts = [
  {
    id: "auto-invest",
    icon: Zap,
    name: "Auto-Invest",
    description: "Automate your crypto purchases daily, weekly, or monthly",
    apy: "Variable",
    term: "Flexible",
    badge: "Popular",
  },
  {
    id: "fixed-term",
    icon: Lock,
    name: "Fixed-Term",
    description: "Lock your crypto for 30, 60, or 90 days for higher returns",
    apy: "12% APY",
    term: "30-90 days",
    badge: "High Yield",
  },
  {
    id: "flexible-earn",
    icon: TrendingUp,
    name: "Flexible Earn",
    description: "Earn daily interest with no lock-up period",
    apy: "8% APY",
    term: "No lock",
    badge: "Flexible",
  },
];

const InvestmentProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof investmentProducts[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStartInvesting = (product: typeof investmentProducts[0]) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const getApyValue = (apyString: string) => {
    if (apyString === 'Variable') return 6;
    return parseFloat(apyString);
  };

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Investment Products</CardTitle>
          <CardDescription>Grow your crypto with our investment options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {investmentProducts.map((product) => {
              const Icon = product.icon;
              return (
                <div
                  key={product.id}
                  className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {product.badge}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold mb-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Returns</p>
                      <p className="font-semibold text-success">{product.apy}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Term</p>
                      <p className="font-semibold">{product.term}</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStartInvesting(product)}
                  >
                    Start Investing
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedProduct && (
        <InvestmentPlanDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          planType={selectedProduct.id as any}
          defaultApy={getApyValue(selectedProduct.apy)}
        />
      )}
    </>
  );
};

export default InvestmentProducts;
