"use client";

import Script from "next/script";
import { useCallback, useState } from "react";
import { SWRConfig } from "swr";

const TELEGRAM_SCRIPT_URL = "https://telegram.org/js/telegram-web-app.js";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, _] = useState();
  const onLoad = useCallback(() => {
    //setTheme(JSON.stringify(window.Telegram.WebApp.themeParams));
    //window.Telegram.WebApp.expand();
  }, []);

  return (
    <>
      <Script src={TELEGRAM_SCRIPT_URL} onReady={onLoad} />
      <div className="code">THEME: {theme}</div>
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
