"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  const environmentId =
    process.env.NODE_ENV == "development"
      ? "d09629d8-033f-44e5-b0f6-23c42da460f7"
      : "eb214338-72ad-42f7-a1fc-4978565acf3c";
  return (
    <DynamicContextProvider
      theme={"dark"}
      settings={{
        environmentId,
        walletConnectors: [SolanaWalletConnectors],
        initialAuthenticationMode: "connect-only",
        // mobileExperience: "in-app-browser",
        recommendedWallets: [
          { walletKey: "okxsolana" },
          { walletKey: "solflare" },
          { walletKey: "glow" },
          { walletKey: "magicedensol" },
          // { walletKey: "phantom" },
        ],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};
export default Providers;
