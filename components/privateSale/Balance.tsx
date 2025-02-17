"use client";
import { getBalanceByWaleltAddress } from "@/app/actions";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useContext, useEffect, useState } from "react";
import PrivateSaleContext, {
  privateSaleContextType,
} from "./context/PrivateSaleContext";
import Image from "next/image";
import Only100KLogo from "@/public/100kLogoBLue.png";

const Balance = () => {
  const [balance, setBalance] = useState<string>("0");
  const { primaryWallet } = useDynamicContext();

  const { refetchBalance, setRefetchBalance } = useContext(
    PrivateSaleContext
  ) as privateSaleContextType;

  const getBalanceFromDB = async () => {
    if (!primaryWallet || !primaryWallet.address) {
      setBalance("0");
      return;
    }
    const balanceData = await getBalanceByWaleltAddress(primaryWallet.address);
    if (balanceData.length > 0) {
      const balanceCalculated = balanceData.reduce((acc, curr) => {
        return acc + Number(curr.mskValue);
      }, 0);
      setBalance(balanceCalculated.toFixed(0));
    }
  };

  useEffect(() => {
    if (primaryWallet) {
      getBalanceFromDB();
    }
  }, [primaryWallet]);

  useEffect(() => {
    if (refetchBalance) {
      getBalanceFromDB();
      setRefetchBalance(false);
    }
  }, [refetchBalance]);

  return (
    <div className="bg-custom-blue h-10">
      <div className="w-full h-full flex-center gap-2">
        <p className="text-sm font-semibold text-white">Your Balance :</p>
        <p className="text-sm font-semibold text-gold flex gap-1">
          {balance}
          {/* <span className="text-[9px] font-bold text-custom-yellow ">
            <span>O100K</span>
          </span> */}
          <Image className="w-14" src={Only100KLogo} alt="Logo" />
        </p>
      </div>
    </div>
  );
};

export default Balance;
