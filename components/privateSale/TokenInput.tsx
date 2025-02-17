"use client";
import React, { useContext, useEffect } from "react";
import PrivateSaleContext, {
  privateSaleContextType,
} from "./context/PrivateSaleContext";
import Image from "next/image";
import Only100K from "@/public/100kLogoBLue.png";

const MskInput = () => {
  const { solValue, mskValue, setMskValue } = useContext(
    PrivateSaleContext
  ) as privateSaleContextType;

  useEffect(() => {
    const mskAmount = Number(solValue) * 1000000;
    setMskValue(mskAmount.toFixed(0));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solValue]);
  return (
    <div className=" relative flex flex-col bg-soft p-2 h-24 justify-center">
      <span className="text-white text-sm font-semibold">You get</span>
      <div className="  m-0 bg-custom-blue rounded-none text-white text-xl font-medium outline-none border-none h-16 flex items-center relative px-2">
        {mskValue === "" ? "0" : mskValue}
        <div className=" top-1/2 -translate-y-1/2 right-1 absolute w-16 h-12 bg-blueSombre flex justify-center items-center">
          <Image src={Only100K} alt="logo" className="w-16" />
        </div>
      </div>
    </div>
  );
};

export default MskInput;
