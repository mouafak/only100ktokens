"use client";
import React, { FC, PropsWithChildren, useState } from "react";
import PrivateSaleContext from "./context/PrivateSaleContext";

const PrivateSaleProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [ethValue, setEthValue] = useState("0");
  const [trtrValue, setTrtrValue] = useState("0");
  return (
    <PrivateSaleContext.Provider
      value={{ ethValue, setEthValue, trtrValue, setTrtrValue }}
    >
      {children}
    </PrivateSaleContext.Provider>
  );
};

export default PrivateSaleProvider;
