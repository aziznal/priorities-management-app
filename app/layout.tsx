import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/client/providers";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
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
          className={`${jetBrainsMono.className} antialiased min-h-screen flex flex-col bg-violet-500`}
        >
          {children}
        </body>
      </html>
    </Providers>
  );
}
