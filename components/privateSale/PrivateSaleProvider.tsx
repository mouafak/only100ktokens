"use client";
import React, { FC, PropsWithChildren, useState } from "react";
import PrivateSaleContext from "./context/PrivateSaleContext";

const PrivateSaleProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [solValue, setSolValue] = useState("1");
  const [mskValue, setMskValue] = useState("0");
  const [yourBalance, setYourBalance] = useState("0");
  return (
    <PrivateSaleContext.Provider
      value={{
        solValue,
        setSolValue,
        mskValue,
        setMskValue,
        yourBalance,
        setYourBalance,
      }}
    >
      {children}
    </PrivateSaleContext.Provider>
  );
};

export default PrivateSaleProvider;
