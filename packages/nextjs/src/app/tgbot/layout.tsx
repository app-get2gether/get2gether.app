"use client";

import Script from "next/script";
import { useCallback, useState } from "react";

const TELEGRAM_SCRIPT_URL = "https://telegram.org/js/telegram-web-app.js";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState();
  const onLoad = useCallback(() => {
    setTheme(JSON.stringify(window.Telegram.WebApp.themeParams));
  }, []);

  return (
    <>
      <Script src={TELEGRAM_SCRIPT_URL} onReady={onLoad} />
      <div className="code">THEME: {theme}</div>
      {children}
    </>
  );
}
