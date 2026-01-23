import React, { useEffect } from "react";
import { useAuth } from "../../services/useAuth";

/**
 * AdScript Component
 * Loads Google AdSense script only for authenticated users without subscription
 */
export default function AdScript(): JSX.Element | null {
  const { user } = useAuth();

  useEffect(() => {
    // Only load ads if user is authenticated and does NOT have subscription
    if (user && user.isAuthenticated && !user.hasSubscription) {
      // Check if script already exists to avoid duplicates
      if (
        !document.querySelector('script[src*="pagead2.googlesyndication.com"]')
      ) {
        const script = document.createElement("script");
        script.async = true;
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7049303928905899";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    }
  }, [user]);

  // This component doesn't render anything, it just manages the script
  return null;
}
