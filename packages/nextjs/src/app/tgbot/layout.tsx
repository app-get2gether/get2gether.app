"use client";

import FooterTabs from "@/components/FooterTabs";
import { WebAppContext } from "@/contexts";
import mockWebApp from "@/utils/mockWebApp";
import Script from "next/script";
import { useCallback, useState } from "react";
import type { WebApp } from "telegram";

const TELEGRAM_SCRIPT_URL = "https://telegram.org/js/telegram-web-app.js";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const onLoad = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      mockWebApp();
    }
    setWebApp(window.Telegram.WebApp);
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }, [setWebApp]);

  return (
    <WebAppContext.Provider value={webApp}>
      <Script src={TELEGRAM_SCRIPT_URL} onLoad={onLoad} />
      <div className="min-h-screen flex flex-col">
        {/*
        <div className="code">THEME: {JSON.stringify(webApp?.themeParams)}</div>
        <div className="code">vieportHeight: {webApp?.viewportHeight}</div>
        */}
        <div className="mb-auto">{children}</div>
        <FooterTabs className="sticky bottom-0" />
      </div>
    </WebAppContext.Provider>
  );
}
