"use client";
import React, { FC, PropsWithChildren, useState } from "react";
import PrivateSaleContext from "./context/PrivateSaleContext";

const PrivateSaleProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [solValue, setSolValue] = useState("1");
  const [mskValue, setMskValue] = useState("0");
  const [yourBalance, setYourBalance] = useState("0");
  const [zodError, setZodError] = useState(false);
  const [refetchBalance, setRefetchBalance] = useState(false);
  return (
    <PrivateSaleContext.Provider
      value={{
        solValue,
        setSolValue,
        mskValue,
        setMskValue,
        yourBalance,
        setYourBalance,
        zodError,
        setZodError,
        refetchBalance,
        setRefetchBalance,
      }}
    >
      {children}
    </PrivateSaleContext.Provider>
  );
};

export default PrivateSaleProvider;
