import React, { createContext } from "react";

export interface privateSaleContextType {
  ethValue: string;
  setEthValue: React.Dispatch<React.SetStateAction<string>>;
  trtrValue: string;
  setTrtrValue: React.Dispatch<React.SetStateAction<string>>;
}

const PrivateSaleContext = createContext<privateSaleContextType | null>(null);

export default PrivateSaleContext;
