import { useState } from "react";
import { Lock, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InvestmentPlanDialog } from "@/components/dialogs/InvestmentPlanDialog";
import { ActiveInvestmentsDialog } from "@/components/dialogs/ActiveInvestmentsDialog";

const investmentProducts = [
  {
    id: "short-term",
    icon: Zap,
    name: "Short-Term Lock",
    description: "Lock your crypto for 2 months and earn competitive returns",
    apy: "8% APY",
    term: "2 months",
    termMonths: 2,
    badge: "Quick Returns",
  },
  {
    id: "semi-annual",
    icon: Lock,
    name: "Semi-Annual Lock",
    description: "Lock your crypto for 6 months for higher returns",
    apy: "15% APY",
    term: "6 months",
    termMonths: 6,
    badge: "High Yield",
  },
  {
    id: "annual",
    icon: TrendingUp,
    name: "Annual Lock",
    description: "Lock your crypto for a full year and maximize your earnings",
    apy: "25% APY",
    term: "12 months",
    termMonths: 12,
    badge: "Best Returns",
  },
];

const InvestmentProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof investmentProducts[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewInvestmentsOpen, setViewInvestmentsOpen] = useState(false);

  const handleStartInvesting = (product: typeof investmentProducts[0]) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleViewInvestments = (product: typeof investmentProducts[0]) => {
    setSelectedProduct(product);
    setViewInvestmentsOpen(true);
  };

  const getApyValue = (apyString: string) => {
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
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStartInvesting(product)}
                    >
                      Invest
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleViewInvestments(product)}
                    >
                      View Active
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedProduct && (
        <>
          <InvestmentPlanDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            planType={selectedProduct.id as any}
            defaultApy={getApyValue(selectedProduct.apy)}
            defaultTermMonths={selectedProduct.termMonths}
          />
          <ActiveInvestmentsDialog
            open={viewInvestmentsOpen}
            onOpenChange={setViewInvestmentsOpen}
            planType={selectedProduct.id}
            productName={selectedProduct.name}
          />
        </>
      )}
    </>
  );
};

export default InvestmentProducts;
