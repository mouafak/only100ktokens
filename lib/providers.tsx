"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  const environmentId = process.env
    .NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string;

  return (
    <DynamicContextProvider
      theme={"dark"}
      settings={{
        environmentId,
        walletConnectors: [SolanaWalletConnectors],
        initialAuthenticationMode: "connect-only",
        // mobileExperience: "redirect",
        recommendedWallets: [
          { walletKey: "phantom" },
          { walletKey: "okxsolana" },
          { walletKey: "solflare" },
        ],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};
export default Providers;
