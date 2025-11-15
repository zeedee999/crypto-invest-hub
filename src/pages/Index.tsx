// import DashboardLayout from "@/components/layout/DashboardLayout";
// import PortfolioCard from "@/components/dashboard/PortfolioCard";
// import MarketOverview from "@/components/dashboard/MarketOverview";
// import InvestmentProducts from "@/components/dashboard/InvestmentProducts";
// import QuickActions from "@/components/dashboard/QuickActions";

// const Index = () => {
//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here's your portfolio overview.</p>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-3">
//           <div className="lg:col-span-2 space-y-6">
//             <PortfolioCard />
//             <QuickActions />
//             <InvestmentProducts />
//           </div>
          
//           <div className="space-y-6">
//             <MarketOverview />
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Index;
// src/pages/Index.tsx (Updated)

import DashboardLayout from "@/components/layout/DashboardLayout";
import PortfolioCard from "@/components/dashboard/PortfolioCard";
// Import the new components
import BalanceCard from "@/components/dashboard/BalanceCard"; 
import TradingViewWidget from "@/components/dashboard/TradingViewWidget";
import MarketOverview from "@/components/dashboard/MarketOverview";
import InvestmentProducts from "@/components/dashboard/InvestmentProducts";
import QuickActions from "@/components/dashboard/QuickActions";

import { DollarSign, Percent, Gift } from "lucide-react"; // Icons for the new cards

const Index = () => {
  // Mock data for the new cards
  const depositBalance = 95000.00;
  const profitBalance = 12847.32;
  const totalBonus = 5000.00;
  // Mock data for the sparkline charts
  const sparkline1Data = [/* data for deposit */];
  const sparkline2Data = [/* data for profit */];
  const sparkline3Data = [/* data for bonus */];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your portfolio overview.</p>
        </div>

        {/* New 3-column grid for Balance Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <BalanceCard
            title="Deposit Balance"
            value={depositBalance}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            chartId="analytic-apexchartssparkline1" // Use the requested ID
            chartData={sparkline1Data}
          />
          <BalanceCard
            title="Profit Balance"
            value={profitBalance}
            icon={<Percent className="h-4 w-4 text-muted-foreground" />}
            chartId="analytic-apexchartssparkline2"
            chartData={sparkline2Data}
          />
          <BalanceCard
            title="Total Bonus"
            value={totalBonus}
            icon={<Gift className="h-4 w-4 text-muted-foreground" />}
            chartId="analytic-apexchartssparkline3"
            chartData={sparkline3Data}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            
            <PortfolioCard />
            
            {/* TradingView Widget added here */}
            <TradingViewWidget /> 
          
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