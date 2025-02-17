import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/client/providers";
import { cn } from "@/lib/client/utils";
import { getIsDarkmode_server } from "@/lib/common/darkmode/server";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Priorities",
  description: "yeh",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDarkmode = await getIsDarkmode_server();

  return (
    <Providers>
      <html lang="en" className={cn(isDarkmode ? "dark" : null)}>
        <body
          className={`${jetBrainsMono.className} flex min-h-screen flex-col bg-amber-200 antialiased dark:bg-slate-900`}
        >
          {children}
        </body>
      </html>
    </Providers>
  );
}
