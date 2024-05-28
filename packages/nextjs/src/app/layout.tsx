import cn from "classnames";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Get2Gether",
  description: " Get2Gether Telegram MiniApp, helps to create events and share with friends.",
};

// TODO: fix issue with zooming inputs/texareas on mobile
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn(inter.className, "touch-none")}>{children}</body>
    </html>
  );
}
