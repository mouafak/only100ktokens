'use client';
import React, { useContext, useEffect } from 'react';
import PrivateSaleContext, {
  PrivateSaleContextType,
} from './context/PrivateSaleContext';
import Image from 'next/image';
import Only100K from '@/public/100kLogoBLue.png';

const TokenInput = () => {
  const { solValue, tokenValue, setTokenValue } = useContext(
    PrivateSaleContext
  ) as PrivateSaleContextType;

  useEffect(() => {
    const tokenAmount = Number(solValue) * 10;
    setTokenValue(tokenAmount.toFixed(2));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solValue]);
  return (
    <div className=" relative flex flex-col bg-soft p-2 h-24 justify-center">
      <span className="text-white text-sm font-semibold">You get</span>
      <div className="  m-0 bg-custom-blue rounded-none text-white text-xl font-medium outline-none border-none h-16 flex items-center relative px-2">
        {tokenValue === '' ? '0' : tokenValue}
        <div className=" top-1/2 -translate-y-1/2 right-1 absolute w-16 h-12 bg-blueSombre flex justify-center items-center">
          <Image loading={'lazy'} src={Only100K} alt="logo" className="w-16" />
        </div>
      </div>
    </div>
  );
};

export default TokenInput;
