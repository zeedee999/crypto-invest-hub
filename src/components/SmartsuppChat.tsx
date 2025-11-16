import { useEffect, useState } from 'react';

declare global {
  interface Window {
    smartsupp?: any;
    _smartsupp?: any;
  }
}

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
    // Initialize Smartsupp configuration
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = '549cec4f199f2304cb12feea3f1454ad8bb7a602';

    if (!isEnabled) {
      // Hide the widget if disabled
      if (window.smartsupp) {
        window.smartsupp('chat:hide');
      }
      return;
    }

    // Show the widget if enabled
    if (window.smartsupp) {
      window.smartsupp('chat:show');
      return;
    }

    // Load Smartsupp script only once
    const existingScript = document.querySelector('script[src*="smartsupp.com"]');
    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://www.smartsuppchat.com/loader.js';
    
    document.head.appendChild(script);

    return () => {
      // Only hide widget on unmount, don't remove script
      if (window.smartsupp) {
        window.smartsupp('chat:hide');
      }
    };
  }, [isEnabled]);

  return null;
}
