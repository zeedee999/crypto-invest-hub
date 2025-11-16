import { useEffect, useState } from 'react';

export function SmartsuppChat() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Check if chat is enabled in localStorage
    const chatPref = localStorage.getItem('chatWidgetEnabled');
    const enabled = chatPref === null ? true : chatPref === 'true';
    setIsEnabled(enabled);

    // Listen for toggle events
    const handleToggle = (event: CustomEvent) => {
      setIsEnabled(event.detail.enabled);
    };

    window.addEventListener('chatWidgetToggle', handleToggle as EventListener);

    return () => {
      window.removeEventListener('chatWidgetToggle', handleToggle as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      // Remove Smartsupp elements if chat is disabled
      const smartsuppWidget = document.querySelector('#smartsupp-widget-container');
      if (smartsuppWidget) {
        smartsuppWidget.remove();
      }
      return;
    }

    // Load Smartsupp chat widget only if enabled
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://widget-page.smartsupp.com/widget/549cec4f199f2304cb12feea3f1454ad8bb7a602';
    
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts or is disabled
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      
      // Remove Smartsupp elements if they exist
      const smartsuppWidget = document.querySelector('#smartsupp-widget-container');
      if (smartsuppWidget) {
        smartsuppWidget.remove();
      }
    };
  }, [isEnabled]);

  return null;
}
