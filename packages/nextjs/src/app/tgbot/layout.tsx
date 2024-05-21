"use client";

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
    mockWebApp();
    setWebApp(window.Telegram.WebApp);
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }, [setWebApp]);

  return (
    <WebAppContext.Provider value={webApp}>
      <Script src={TELEGRAM_SCRIPT_URL} onReady={onLoad} />
      <div className="code">THEME: {JSON.stringify(webApp?.themeParams)}</div>
      {children}
    </WebAppContext.Provider>
  );
}
