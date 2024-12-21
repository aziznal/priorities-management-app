import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/client/providers";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Priorities",
  description: "yeh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body
          className={`${jetBrainsMono.variable} font-mono antialiased min-h-screen flex flex-col bg-indigo-500`}
        >
          {children}
        </body>
      </html>
    </Providers>
  );
}
