import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import LocalFont from "next/font/local";
import Providers from "@/lib/providers";

const electrolizeFont = LocalFont({
  src: "../public/fonts/Electrolize.woff2",
  variable: "--font-electrolize",
  style: "normal",
});
const pressStart2P = LocalFont({
  src: "../public/fonts/PressStart2P-Regular.woff2",
  variable: "--font-press-start-2p",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Musk Drive",
  description:
    "Join the ride—because with MuskDrive, the future is always in the fast lane!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` 
      ${electrolizeFont.className}
      `}
      >
        <Providers>{children}</Providers>
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}
