import { useEffect, useState } from "react";

declare global {
  interface Window {
    smartsupp?: any;
    _smartsupp?: any;
  }
}

export function SmartsuppChat() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Chat preference
    const pref = localStorage.getItem("chatWidgetEnabled");
    setIsEnabled(pref === null ? true : pref === "true");

    const handleToggle = (event: CustomEvent) => {
      setIsEnabled(event.detail.enabled);
    };

    window.addEventListener("chatWidgetToggle", handleToggle as EventListener);

    return () =>
      window.removeEventListener(
        "chatWidgetToggle",
        handleToggle as EventListener
      );
  }, []);

  useEffect(() => {
    // Set smartsupp key
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = "549cec4f199f2304cb12feea3f1454ad8bb7a602";

    if (!isEnabled) {
      window.smartsupp?.("chat:hide");
      return;
    }

    // --- REQUIRED BOOTSTRAP (YOU MISSED THIS PART) ---
    if (!window.smartsupp) {
      const s = document.getElementsByTagName("script")[0];
      const c = document.createElement("script");

      window.smartsupp = function () {
        (window.smartsupp._ = window.smartsupp._ || []).push(arguments);
      };

      c.type = "text/javascript";
      c.charset = "utf-8";
      c.async = true;
      c.src = "https://www.smartsuppchat.com/loader.js?";
      s.parentNode?.insertBefore(c, s);
    }

    // show widget
    window.smartsupp("chat:show");
  }, [isEnabled]);

  return null;
}