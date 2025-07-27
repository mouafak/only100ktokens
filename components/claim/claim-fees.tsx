'use client';
import SolanaLogo from '@/public/solanaLogo.png';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import PrivateSaleContext, {
  PrivateSaleContextType,
} from '../privateSale/context/PrivateSaleContext';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { EXCLUDED_WALLETS } from '@/constant/excluded-wallets';

const ClaimFees = () => {
  const { feeAmount } = useContext(
    PrivateSaleContext
  ) as PrivateSaleContextType;
  const [excludedFromFees, setExcludedFromFees] = useState(false);
  const isConnected = useIsLoggedIn();
  const { primaryWallet } = useDynamicContext();

  useEffect(() => {
    if (isConnected && primaryWallet) {
      // Check if the user is excluded from fees
      const isExcluded = EXCLUDED_WALLETS.includes(primaryWallet.address);
      setExcludedFromFees(isExcluded);
    }
  }, [isConnected, primaryWallet]);

  return (
    <div className=" relative flex flex-col bg-soft p-2 h-24 justify-center">
      <span className="text-white text-sm font-semibold">14% Fees in SOL</span>
      <div className="  m-0 bg-custom-blue rounded-none text-white text-xl font-medium outline-none border-none h-16 flex items-center relative px-2">
        {excludedFromFees && parseFloat(feeAmount) > 0 ? (
          <p className="">
            <span className=" line-through decoration-red-700 decoration-2 text-sm">
              {feeAmount}
            </span>
            <span className=""> 0</span>
          </p>
        ) : (
          feeAmount
        )}
        <span className="text-sm pl-1 text-gold"> + transaction fees</span>
        <div className=" top-1/2 -translate-y-1/2 right-1 absolute w-12 h-12 bg-blueSombre flex justify-center items-center">
          <Image
            loading={'lazy'}
            src={SolanaLogo}
            alt="logo"
            className="p-2 w-10 h-10"
          />
        </div>
      </div>
      {excludedFromFees && parseFloat(feeAmount) > 0 && (
        <p className="absolute bottom-2 left-2 text-xs text-lime-600">
          You are excluded from fees ✌️
        </p>
      )}
    </div>
  );
};
export default ClaimFees;
