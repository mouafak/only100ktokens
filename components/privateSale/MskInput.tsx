"use client";
import React, { useContext, useEffect } from "react";
import PrivateSaleContext, {
  privateSaleContextType,
} from "./context/PrivateSaleContext";
import MskLogo from "@/public/mskLogo.png";
import Image from "next/image";

const MskInput = () => {
  const { solValue, mskValue, setMskValue } = useContext(
    PrivateSaleContext
  ) as privateSaleContextType;

  useEffect(() => {
    const mskAmount = Number(solValue) * 100000;
    setMskValue(mskAmount.toFixed(0));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solValue]);
  return (
    <div className=" relative flex flex-col bg-soft p-2 h-24 justify-center">
      <span className="text-white text-sm font-semibold">You get</span>
      <div className="  m-0 bg-custom-blue rounded-none text-white text-xl font-medium outline-none border-none h-16 flex items-center relative px-2">
        {mskValue === "" ? "0" : mskValue}
        <Image
          src={MskLogo}
          alt="logo"
          width={40}
          height={40}
          className="top-1/2 -translate-y-1/2 right-1 absolute"
        />
      </div>
    </div>
  );
};

export default MskInput;
