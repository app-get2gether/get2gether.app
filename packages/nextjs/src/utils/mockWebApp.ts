import { WebApp } from "telegram";

// Mock the Telegram Web App to allow work with it in the browser
const mockWebApp = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (!process.env.NEXT_PUBLIC_MOCK_TELEGRAM) {
    return;
  }

  if (window.Telegram?.WebApp?.initData !== "") {
    return;
  }

  if (!process.env.NEXT_PUBLIC_MOCK_INIT_DATA) {
    throw new Error("Please provide the NEXT_PUBLIC_MOCK_INIT_DATA environment variable");
  }

  window.Telegram = {
    WebApp: {
      ...window.Telegram.WebApp,
      initData: process.env.NEXT_PUBLIC_MOCK_INIT_DATA,
    } as WebApp,
  };
};

export default mockWebApp;
