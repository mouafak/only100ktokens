import React, { createContext } from "react";

export interface privateSaleContextType {
  solValue: string;
  setSolValue: React.Dispatch<React.SetStateAction<string>>;
  tokenValue: string;
  setTokenValue: React.Dispatch<React.SetStateAction<string>>;
  yourBalance: string;
  setYourBalance: React.Dispatch<React.SetStateAction<string>>;
  zodError: boolean;
  setZodError: React.Dispatch<React.SetStateAction<boolean>>;
  refetchBalance: boolean;
  setRefetchBalance: React.Dispatch<React.SetStateAction<boolean>>;
  piWalletAddress: string;
  setPiWalletAddress: React.Dispatch<React.SetStateAction<string>>;
}

const PrivateSaleContext = createContext<privateSaleContextType | null>(null);

export default PrivateSaleContext;
