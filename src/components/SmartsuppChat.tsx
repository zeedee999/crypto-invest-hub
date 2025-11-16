import { useEffect } from 'react';

export function SmartsuppChat() {
  useEffect(() => {
    // Load Smartsupp chat widget
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://widget-page.smartsupp.com/widget/549cec4f199f2304cb12feea3f1454ad8bb7a602';
    
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      document.head.removeChild(script);
      
      // Remove Smartsupp elements if they exist
      const smartsuppWidget = document.querySelector('#smartsupp-widget-container');
      if (smartsuppWidget) {
        smartsuppWidget.remove();
      }
    };
  }, []);

  return null;
}
