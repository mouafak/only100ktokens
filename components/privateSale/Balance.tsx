"use client";
import React, { useContext } from "react";
import PrivateSaleContext, {
  privateSaleContextType,
} from "./context/PrivateSaleContext";
// import { useAccount } from "wagmi";

const Balance = () => {
  const { yourBalance } = useContext(
    PrivateSaleContext
  ) as privateSaleContextType;

  // const { isConnected } = useAppKitAccount();

  return (
    <div className="bg-custom-blue h-10">
      <div className="w-full h-full flex-center gap-2">
        <p className="text-sm font-semibold text-white">Your Balance :</p>
        <p className="text-sm font-semibold text-white flex gap-1">
          {"0"}
          <span className="text-[9px] font-bold text-custom-yellow ">
            <span>MSK</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Balance;
