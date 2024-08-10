import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const metadata = {
  name: "TRUMP’S TRIUMPH",
  description: "The Meme Coin Supporting Donald Trump ",
  url: "https://trumptriumphcoin.com/", // origin must match your domain & subdomain
  icons: [
    "https://trumptriumphcoin.com/wp-content/uploads/2024/07/Trump-Triumph-2.webp",
  ],
};

// Create wagmiConfig
const chains = [mainnet] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  auth: {
    email: false,
  },
});
