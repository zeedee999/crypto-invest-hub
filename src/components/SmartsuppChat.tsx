import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    smartsupp?: any;
    _smartsupp?: any;
  }
}

export function SmartsuppChat() {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const loadChatPreference = async () => {
      if (!user) {
        setIsEnabled(true);
        return;
      }

      try {
        // Load from database for logged-in users
        const { data: profile } = await supabase
          .from("profiles")
          .select("chat_enabled")
          .eq("id", user.id)
          .single();

        if (profile) {
          setIsEnabled(profile.chat_enabled ?? true);
        }
      } catch (error) {
        console.error("Error loading chat preference:", error);
        setIsEnabled(true);
      }
    };

    loadChatPreference();

    const handleToggle = (event: CustomEvent) => {
      setIsEnabled(event.detail.enabled);
    };

    window.addEventListener("chatWidgetToggle", handleToggle as EventListener);

    return () =>
      window.removeEventListener(
        "chatWidgetToggle",
        handleToggle as EventListener
      );
  }, [user]);

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