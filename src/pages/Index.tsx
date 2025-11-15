import DashboardLayout from "@/components/layout/DashboardLayout";
import PortfolioCard from "@/components/dashboard/PortfolioCard";
import MarketOverview from "@/components/dashboard/MarketOverview";
import InvestmentProducts from "@/components/dashboard/InvestmentProducts";
import QuickActions from "@/components/dashboard/QuickActions";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your portfolio overview.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <PortfolioCard />
            <QuickActions />
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
