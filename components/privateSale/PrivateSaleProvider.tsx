'use client';
import React, { FC, PropsWithChildren, useState } from 'react';
import PrivateSaleContext from './context/PrivateSaleContext';

const PrivateSaleProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [solValue, setSolValue] = useState('1');
  const [tokenValue, setTokenValue] = useState('0');
  const [yourBalance, setYourBalance] = useState('0');
  const [zodError, setZodError] = useState(false);
  const [refetchBalance, setRefetchBalance] = useState(false);
  const [piWalletAddress, setPiWalletAddress] = useState('');
  const [feeAmount, setFeeAmount] = useState('0');
  const [claimAmount, setClaimAmount] = useState('0');
  return (
    <PrivateSaleContext.Provider
      value={{
        solValue,
        setSolValue,
        tokenValue,
        setTokenValue,
        yourBalance,
        setYourBalance,
        zodError,
        setZodError,
        refetchBalance,
        setRefetchBalance,
        piWalletAddress,
        setPiWalletAddress,
        feeAmount,
        setFeeAmount,
        claimAmount,
        setClaimAmount,
      }}
    >
      {children}
    </PrivateSaleContext.Provider>
  );
};

export default PrivateSaleProvider;
