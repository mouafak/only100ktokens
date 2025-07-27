'use client';
import Only100K from '@/public/100kLogoBLue.png';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import PrivateSaleContext, {
  PrivateSaleContextType,
} from '../privateSale/context/PrivateSaleContext';
import { getTotalClaimedTokensByWalletAddress } from '@/app/actions';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
const TokenAmount = () => {
  const { claimAmount } = useContext(
    PrivateSaleContext
  ) as PrivateSaleContextType;
  const isConnected = useIsLoggedIn();
  const { primaryWallet } = useDynamicContext();
  const [totalClaimedTokens, setTotalClaimedTokens] = useState('0');

  const getTotalClaimedTokens = async () => {
    if (!isConnected || !primaryWallet) {
      return;
    }
    const totalClaimedTokens = await getTotalClaimedTokensByWalletAddress(
      primaryWallet.address
    );
    setTotalClaimedTokens(totalClaimedTokens);
  };

  useEffect(() => {
    if (!isConnected || !primaryWallet) {
      return;
    }
    getTotalClaimedTokens();
  }, [isConnected, primaryWallet, claimAmount]);

  return (
    <div className=" relative flex flex-col bg-soft p-2 h-24 justify-center">
      <span className="text-white text-sm font-semibold ">
        Tokens available to claim
      </span>
      <div className="  m-0 bg-custom-blue rounded-none text-white text-xl font-medium outline-none border-none h-16 flex items-center relative px-2">
        {claimAmount}
        <div className=" top-1/2 -translate-y-1/2 right-1 absolute w-16 h-12 bg-blueSombre flex justify-center items-center">
          <Image loading={'lazy'} src={Only100K} alt="logo" className="w-16" />
        </div>
      </div>
      <div className="absolute bottom-2 left-2 text-white/60 text-xs">
        <span>Claimed Tokens: </span>
        <span className="text-gold">{totalClaimedTokens}</span>
      </div>
    </div>
  );
};
export default TokenAmount;
