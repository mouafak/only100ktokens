"use client";
import React, { useContext, useEffect, useState } from "react";
import PrivateSaleContext, {
  privateSaleContextType,
} from "./context/PrivateSaleContext";
import TrumpTriumphLogo from "@/public/TrumpTriumphLogo.png";
import Image from "next/image";

const TrtrInput = () => {
  const { ethValue, trtrValue, setTrtrValue } = useContext(
    PrivateSaleContext
  ) as privateSaleContextType;

  useEffect(() => {
    const trtrAmount = Number(ethValue) * 1e12;
    setTrtrValue(trtrAmount.toFixed(2));
    // console.log(trtrAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethValue]);
  return (
    <div className=" relative flex flex-col bg-custom-blue p-2">
      <span className="text-white text-sm font-semibold">You get</span>
      <div className="  m-0 bg-custom-blue rounded-none text-white text-2xl font-medium outline-none border-none h-16 flex items-center relative px-2">
        {trtrValue === "" ? "0" : trtrValue}
        <Image
          src={TrumpTriumphLogo}
          alt="logo"
          width={40}
          height={40}
          className="top-1/2 -translate-y-1/2 right-1 absolute"
        />
      </div>
    </div>
  );
};

export default TrtrInput;
