'use client';

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';
import { ReactNode } from 'react';

const Providers = ({ children }: { children: ReactNode }) => {
  const environmentId = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID as string;

  // Vérification que l'environment ID est défini
  if (!environmentId) {
    console.error('NEXT_PUBLIC_DYNAMIC_ENV_ID is not defined');
    return <div>Configuration error: Missing environment ID</div>;
  }

  return (
    <DynamicContextProvider
      theme={'dark'}
      settings={{
        environmentId,
        walletConnectors: [SolanaWalletConnectors],
        initialAuthenticationMode: 'connect-only',
        // mobileExperience: "in-app-browser",
        recommendedWallets: [
          { walletKey: 'phantom' },
          // { walletKey: "okxsolana" },
          { walletKey: 'solflare' },
          // { walletKey: "glow" },
          // { walletKey: "magicedensol" },
        ],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};
export default Providers;
