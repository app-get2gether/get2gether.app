"use client";

import Script from "next/script";
import { useCallback, useState } from "react";
import { SWRConfig } from "swr";
import type { WebApp } from "telegram";

const TELEGRAM_SCRIPT_URL = "https://telegram.org/js/telegram-web-app.js";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [webApp, setWebApp] = useState<WebApp>();
  const onLoad = useCallback(() => {
    setWebApp(window.Telegram.WebApp);
    window.Telegram.WebApp.expand();
  }, [setWebApp]);

  return (
    <>
      <Script src={TELEGRAM_SCRIPT_URL} onReady={onLoad} />
      <div className="code">THEME: {JSON.stringify(webApp?.themeParams)}</div>
      <SWRConfig
        value={{
          fetcher: (path: string, ...args) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, ...args).then(res => res.json()),
        }}
      >
        {children}
      </SWRConfig>
    </>
  );
}
