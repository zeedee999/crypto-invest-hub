// src/components/dashboard/TradingViewWidget.tsx

const TradingViewWidget = () => {
  return (
    <div className="shadow-card p-0 rounded-xl overflow-hidden">
      <div className="tradingview-widget-container" style={{ height: "400px", width: "100%" }}>
        <div id="tradingview_d43f4" style={{ height: "100%", width: "100%" }}>
          {/* The TradingView widget script will target this div ID ('tradingview_d43f4') 
            and load the chart content here. 
            Ensure the TradingView script is loaded in your main HTML file.
          */}
          <div className="flex items-center justify-center h-full bg-background/50 text-muted-foreground">
            TradingView Chart Placeholder (Ensure the script is loaded)
          </div>
        </div>
        {/* You may need a tradingview-widget-copyright div here as well, depending on the widget type */}
      </div>
    </div>
  );
};

export default TradingViewWidget;