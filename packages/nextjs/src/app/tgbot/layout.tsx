"use client";

import FooterTabs from "@/components/FooterTabs";
import { WebAppContext } from "@/contexts";
import mockWebApp from "@/utils/mockWebApp";
import Script from "next/script";
import { useCallback, useState } from "react";
import type { WebApp } from "telegram";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import Colorjs from "colorjs.io";

import i18n from "@/i18n";
import { parseUserData } from "@/utils/telegram";

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
    const userData = parseUserData(window.Telegram.WebApp.initData);
    i18n.changeLanguage(userData.language_code);

    setWebApp(window.Telegram.WebApp);
    // retrieve the main background color of the theme
    // not needed when telegram theme is used
    const backgroundColor = getComputedStyle(document.documentElement).backgroundColor;
    if (backgroundColor) {
      const hex = new Colorjs(backgroundColor).to("srgb").toString({ format: "hex" });
      window.Telegram.WebApp.setHeaderColor(hex);
    }

    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }, [setWebApp]);

  return (
    <WebAppContext.Provider value={webApp}>
      <TonConnectUIProvider manifestUrl={`/manifest.json`}>
        <Script src={TELEGRAM_SCRIPT_URL} onLoad={onLoad} />
        <div className="h-screen flex flex-col items-between">
          {/*
        <div className="code">THEME: {JSON.stringify(webApp?.themeParams)}</div>
        <div className="code">vieportHeight: {webApp?.viewportHeight}</div>
        */}
          <div className="h-full touch-auto overflow-scroll">{children}</div>
          <FooterTabs className="absolute bottom-0 touch-none" />
        </div>
      </TonConnectUIProvider>
    </WebAppContext.Provider>
  );
}
