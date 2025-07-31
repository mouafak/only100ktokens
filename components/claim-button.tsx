'use client';

import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { Button } from './ui/button';
import { Transaction } from '@solana/web3.js';
import { useContext, useEffect, useState } from 'react';
import {
  getSolanaAndTokenBalance,
  prepareTransaction,
  submitTransaction,
} from '@/app/actions';
import { isSolanaWallet } from '@dynamic-labs/solana';
import { toast } from 'sonner';
import PrivateSaleContext, {
  PrivateSaleContextType,
} from './privateSale/context/PrivateSaleContext';
import { EXCLUDED_WALLETS } from '@/constant/excluded-wallets';
import { Loader } from 'lucide-react';

const ClaimButton = () => {
  const isConnected = useIsLoggedIn();
  const { primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(false);
  const [solanaAmount, setSolanaAmount] = useState('0');

  const {
    setRefetchBalance,
    claimAmount,
    feeAmount,
    setClaimAmount,
    setFeeAmount,
  } = useContext(PrivateSaleContext) as PrivateSaleContextType;

  const solanaRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

  if (!solanaRpcUrl) {
    throw new Error('Solana RPC URL is not defined in environment variables');
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  //  validation checks
  const validateClaimConditions = () => {
    if (!primaryWallet) {
      console.error('Wallet not connected');
      toast.error('Wallet not connected');
      return false;
    }

    if (parseFloat(claimAmount) <= 0) {
      console.error('Insufficient claim amount');
      toast.error('Insufficient claim amount');
      return false;
    }

    return true;
  };

  const getClaimAmounts = async () => {
    if (!primaryWallet) {
      console.error('Wallet not connected');
      return;
    }

    const fetchedAmountsFromDatabase = await getSolanaAndTokenBalance(
      primaryWallet.address
    );
    if (!fetchedAmountsFromDatabase) {
      console.error('Failed to fetch claim amounts');
      return;
    }
    setSolanaAmount(fetchedAmountsFromDatabase.solanaBalance);
    setClaimAmount(fetchedAmountsFromDatabase.tokenBalance);
    setFeeAmount(
      (parseFloat(fetchedAmountsFromDatabase.solanaBalance) * 0.14).toFixed(2)
    );
  };

  useEffect(() => {
    if (isConnected) {
      getClaimAmounts();
    }
  }, [isConnected, primaryWallet]);
  // prepare and sign the transaction
  const prepareAndSignTransaction = async (userWallet: string) => {
    const preparedTransaction = await prepareTransaction({
      userWallet: userWallet,
    });
    if (
      !preparedTransaction.success ||
      !preparedTransaction.serializedTransaction
    ) {
      console.error(
        'Failed to prepare transaction:',
        preparedTransaction.message
      );
      return;
    }

    const transaction = Transaction.from(
      Buffer.from(preparedTransaction.serializedTransaction, 'base64')
    );

    if (!isSolanaWallet(primaryWallet!)) {
      console.error('Primary wallet is not a Solana wallet');
      return;
    }
    const signer = await primaryWallet!.getSigner();
    const signedTransaction = await signer.signTransaction(transaction);
    if (!signedTransaction) {
      console.error('Failed to sign transaction');
      return;
    }
    return signedTransaction;
  };
  //  function claim handler
  const claimHandler = async () => {
    try {
      // Validate claim conditions
      if (!validateClaimConditions()) {
        setIsLoading(false);
        return;
      }
      // Lock the claim process
      setIsLoading(true);

      toast.info('Claiming your tokens, please wait...', {
        id: 'claiming-tokens',
      });
      const userWallet = primaryWallet!.address;

      // Prepare and sign the transaction
      const signedTransaction = await prepareAndSignTransaction(userWallet);
      if (!signedTransaction) {
        setIsLoading(false);
        toast.error('Failed to prepare and sign transaction', {
          id: 'claiming-tokens',
        });
        return;
      }
      const serializedTransaction = Buffer.from(
        signedTransaction.serialize({
          requireAllSignatures: false,
        })
      ).toString('base64');
      console.log('Base64 Transaction:', serializedTransaction);
      // submit the signed transaction
      const submitResult = await submitTransaction({
        serializedTransaction,
        userWallet,
        solanaAmount,
        tokenAmount: claimAmount,
        feeAmount: EXCLUDED_WALLETS.includes(userWallet) ? '0' : feeAmount,
      });
      if (submitResult.error && !submitResult.success) {
        setIsLoading(false);
        toast.error(submitResult.message, {
          id: 'claiming-tokens',
        });
        return;
      }
      if (submitResult.success) {
        console.log('Transaction submitted successfully:', submitResult);
        toast.success('Transaction submitted successfully', {
          id: 'claiming-tokens',
        });
        setIsLoading(false);
        setRefetchBalance(true);
        await getClaimAmounts();
      }
    } catch (error) {
      // Handle any errors that occur during the claim process
      setIsLoading(false);
      toast.error('An error occurred while claiming your tokens', {
        id: 'claiming-tokens',
      });
      console.error('An error occurred while claiming your tokens:', error);
    }
  };

  return (
    isConnected && (
      <Button
        className="rounded-none w-full bg-soft hover:bg-blueDarken text-foreground disabled:bg-blueDarken/80 text-lg flex-center gap-2"
        onClick={claimHandler}
        disabled={
          isLoading ||
          !primaryWallet ||
          !(parseFloat(claimAmount) > 0) ||
          !isConnected
        }
      >
        {isLoading ? (
          <>
            <span> Processing</span>
            <Loader className="w-4 h-4 animate-spin " />
          </>
        ) : (
          'Claim Now'
        )}
      </Button>
    )
  );
};

export default ClaimButton;
