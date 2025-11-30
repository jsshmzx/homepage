import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "拼图游戏 - Puzzle Game",
  description: "一个有趣的拼图游戏，支持低中高三个难度",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;

  return (
    <html lang="zh-CN">
      <head>
        {umamiWebsiteId && umamiSrc && (
          <Script
            defer
            src={umamiSrc}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
