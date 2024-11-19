import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import AppKitProvider from "@/context/wagmi";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TRUMP'S TRIUMPH",
  description: "The Meme Coin Supporting Donald Trump",
};

export default async function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>
) {
  const initialState = cookieToInitialState(config, (await headers()).get("cookie"));
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppKitProvider initialState={initialState}>{children}</AppKitProvider>
        <Toaster theme="light" />
      </body>
    </html>
  );
}
