'use client';

import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { Button } from './ui/button';
import { Connection, SendTransactionError, Transaction } from '@solana/web3.js';
import { useContext, useEffect, useState } from 'react';
import {
  createClaimTransaction,
  getUnconfirmedClaimTransactionsByWalletAddress,
  getSolanaAndTokenBalance,
  prepareTransaction,
  updateClaimTransactionByTxHashSetConfirmed,
  updatePrivateSaleSetBalanceZero,
  submitTransaction,
} from '@/app/actions';
import { isSolanaWallet } from '@dynamic-labs/solana';
import { toast } from 'sonner';
import PrivateSaleContext, {
  PrivateSaleContextType,
} from './privateSale/context/PrivateSaleContext';
import { EXCLUDED_WALLETS } from '@/constant/excluded-wallets';

const ClaimButton = () => {
  const isConnected = useIsLoggedIn();
  const { primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(false);
  const [solanaAmount, setSolanaAmount] = useState('0');
  const [claimStatus, setClaimStatus] = useState<
    'idle' | 'processing' | 'completed' | 'failed'
  >('idle');

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
    if (claimStatus === 'processing') {
      console.error('Claim is already in progress');
      toast.error('Claim is already in progress');
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

  // check if user already claimed but transaction is not confirmed
  const checkUnconfirmedClaim = async () => {
    setIsLoading(true);
    if (!primaryWallet) {
      console.error('Wallet not connected');
      return;
    }

    try {
      const unconfirmedClaim =
        await getUnconfirmedClaimTransactionsByWalletAddress(
          primaryWallet.address
        );

      if (
        unconfirmedClaim.length > 0 &&
        unconfirmedClaim[0].isConfirmed === false
      ) {
        console.log('Unconfirmed claim transaction found:', unconfirmedClaim);
        toast.info(
          'You have an unconfirmed claim transaction. Please wait for confirmation.',
          {
            id: 'unconfirmed-claim',
          }
        );
        const connection = new Connection(solanaRpcUrl);
        const confirmation = await connection.getSignatureStatus(
          unconfirmedClaim[0].txHash,
          { searchTransactionHistory: true }
        );
        console.log('Confirmation status:', confirmation);
        if (
          confirmation.value?.confirmationStatus === 'confirmed' ||
          confirmation.value?.confirmationStatus === 'finalized'
        ) {
          const updateDatabase =
            await updateClaimTransactionByTxHashSetConfirmed({
              txHash: unconfirmedClaim[0].txHash,
              isConfirmed: true,
            });
          const setBalanceZero = await updatePrivateSaleSetBalanceZero(
            primaryWallet.address
          );
          if (updateDatabase && setBalanceZero) {
            await getClaimAmounts();
            setRefetchBalance(true);
            console.log('Unconfirmed claim transaction confirmed ✅');
            toast.success('Claim transaction confirmed successfully ✅', {
              id: 'unconfirmed-claim',
              duration: 5000,
            });
          } else {
            console.error(
              'Failed to update unconfirmed claim transaction in database'
            );
            toast.error('Failed to update unconfirmed claim transaction');
          }
        }
        setIsLoading(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking unconfirmed claim:', error);
      toast.error('Error checking unconfirmed claim');
      setIsLoading(false);
    }
  };

  //  save the signed transaction to the database
  const saveClaimToDatabase = async ({
    walletAddress,
    signature,
  }: {
    walletAddress: string;
    signature: string;
  }) => {
    const claimCreated = await createClaimTransaction({
      walletAddress,
      solanaValue: solanaAmount,
      feeAmount: EXCLUDED_WALLETS.includes(walletAddress) ? '0' : feeAmount,
      tokenValue: claimAmount,
      txHash: signature,
    });
    if (!claimCreated) {
      console.error('Failed to create claim transaction in database');
      return;
    }
    return claimCreated;
  };

  // update database with claim transaction set to confirmed
  const updateClaimTransactionSetIsConfirmed = async (signature: string) => {
    try {
      const updateDatabase = await updateClaimTransactionByTxHashSetConfirmed({
        txHash: signature,
        isConfirmed: true,
      });
      return updateDatabase;
    } catch (error) {
      console.error('Error updating claim transaction:', error);
      return;
    }
  };

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

  //  submit the signed transaction
  // const submitTransaction = async (signedTransaction: Transaction) => {
  //   try {
  //     const connection = new Connection(solanaRpcUrl);
  //     const signature = await connection.sendRawTransaction(
  //       signedTransaction.serialize(),
  //       {
  //         skipPreflight: false,
  //         preflightCommitment: 'confirmed',
  //       }
  //     );
  //     console.log('Transaction submitted successfully:', signature);
  //     return signature;
  //   } catch (error) {
  //     console.error('Error submitting transaction:', error);
  //   }
  // };

  // confirm the transaction
  // const confirmTransaction = async (signature: string) => {
  //   if (!isSolanaWallet(primaryWallet!)) {
  //     console.error('Primary wallet is not a Solana wallet');
  //     return false;
  //   }
  //   const connection = await primaryWallet.getConnection();
  //   const confirmation = await connection.getSignatureStatus(signature);

  //   if (confirmation.value?.err) {
  //     console.error('Transaction failed to confirm', confirmation.value.err);
  //     return false;
  //   }
  //   if (
  //     confirmation.value?.confirmationStatus === 'confirmed' ||
  //     confirmation.value?.confirmationStatus === 'finalized'
  //   ) {
  //     const [updateDatabase, setBalanceZero] = await Promise.all([
  //       updateClaimTransactionByTxHashSetConfirmed({
  //         txHash: signature,
  //         isConfirmed: true,
  //       }),
  //       updatePrivateSaleSetBalanceZero(primaryWallet.address),
  //     ]);

  //     if (!updateDatabase || !setBalanceZero) {
  //       console.error('Failed to update claim transaction in database');
  //       return false;
  //     }
  //     await getClaimAmounts();
  //     setRefetchBalance(true);
  //     return true;
  //   }
  //   return false;
  // };

  //  function claim handler
  const claimHandler = async () => {
    try {
      // Check if the user has an unconfirmed claim transaction
      const hasUnconfirmedClaim = await checkUnconfirmedClaim();
      if (hasUnconfirmedClaim) {
        setIsLoading(false);
        return;
      }
      await sleep(1000); // Wait for 1 second before proceeding

      // Validate claim conditions
      if (!validateClaimConditions()) {
        setIsLoading(false);
        return;
      }

      // Lock the claim process
      setClaimStatus('processing');
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
        setClaimStatus('idle');
        return;
      }
      if (submitResult.success) {
        console.log('Transaction submitted successfully:', submitResult);
        toast.success('Transaction submitted successfully', {
          id: 'claiming-tokens',
        });
        setClaimStatus('completed');
        setIsLoading(false);
        setRefetchBalance(true);
        await getClaimAmounts();
      }

      // // save the signed transaction to the database
      // const savedToDatabase = await saveClaimToDatabase({
      //   walletAddress: userWallet,
      //   signature: signature!,
      // });
      // if (!savedToDatabase) {
      //   setIsLoading(false);
      //   toast.error('Failed to create claim transaction in database', {
      //     id: 'claiming-tokens',
      //   });
      //   return;
      // }
      // // Confirm the transaction
      // const isConfirmed = await confirmTransaction(signature);
      // if (!isConfirmed) {
      //   setIsLoading(false);
      //   toast.error('Transaction confirmation failed', {
      //     id: 'claiming-tokens',
      //   });
      //   return;
      // }

      // // update claim transaction set to confirmed
      // const updateClaimTransaction = await updateClaimTransactionSetIsConfirmed(
      //   signature
      // );
      // if (!updateClaimTransaction) {
      //   setIsLoading(false);
      //   toast.error('Failed to update claim transaction in database', {
      //     id: 'claiming-tokens',
      //   });
      //   return;
      // }

      // // update claim transaction set to confirmed
      // const updateClaimTransaction = await updateClaimTransactionSetIsConfirmed(
      //   signature
      // );
      // if (!updateClaimTransaction) {
      //   setIsLoading(false);
      //   toast.error('Failed to update claim transaction in database', {
      //     id: 'claiming-tokens',
      //   duration: 5000,
      // });
      // console.log('Claim transaction confirmed successfully ✅');
    } catch (error) {
      // Handle any errors that occur during the claim process
      setIsLoading(false);
      setClaimStatus('failed');
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
        {isLoading ? 'Claiming...' : 'Claim Now'}
      </Button>
    )
  );
};

export default ClaimButton;
