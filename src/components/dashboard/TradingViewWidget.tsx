// src/components/dashboard/TradingViewWidget.tsx (Revised)

import React, { useEffect, useRef } from 'react';

// Define the type for the global TradingView object if it exists (optional but good practice)
declare global {
  interface Window {
    TradingView: {
      widget: (config: any) => void;
    };
  }
}

const TradingViewWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Check if the script is already loaded
    if (!document.getElementById('tradingview-widget-script')) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.id = 'tradingview-widget-script'; // Give it an ID to prevent duplicates
      script.type = 'text/javascript';
      script.async = true;
      document.head.appendChild(script);
    }
    
    // 2. Function to initialize the widget
    const initializeWidget = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget(
          {
            "container_id": "tradingview_d43f4", // Must match the div ID
            "symbol": "NASDAQ:TSLA", // Example symbol, change as needed
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "light", // Or "dark"
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "width": "100%",
            "height": "100%",
            // Add any other specific widget properties here
          }
        );
      }
    };

    // 3. Wait for the script to load before initializing
    const timeout = setTimeout(initializeWidget, 1000); // Wait 1 second for safety

    // 4. Cleanup function
    return () => {
      clearTimeout(timeout);
      // Optional: You could try to remove the widget here if necessary
    };

  }, []); // Run only once on mount

  return (
    <div className="shadow-card p-0 rounded-xl overflow-hidden">
      <div 
        ref={containerRef}
        className="tradingview-widget-container" 
        style={{ height: "400px", width: "100%" }}
      >
        <div id="tradingview_d43f4" style={{ height: "100%", width: "100%" }}>
          {/* Chart will load here */}
        </div>
      </div>
    </div>
  );
};

export default TradingViewWidget;