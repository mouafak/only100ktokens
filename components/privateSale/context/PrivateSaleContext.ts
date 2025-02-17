import React, { createContext } from "react";

export interface privateSaleContextType {
  solValue: string;
  setSolValue: React.Dispatch<React.SetStateAction<string>>;
  mskValue: string;
  setMskValue: React.Dispatch<React.SetStateAction<string>>;
  yourBalance: string;
  setYourBalance: React.Dispatch<React.SetStateAction<string>>;
  zodError: boolean;
  setZodError: React.Dispatch<React.SetStateAction<boolean>>;
  refetchBalance: boolean;
  setRefetchBalance: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrivateSaleContext = createContext<privateSaleContextType | null>(null);

export default PrivateSaleContext;
