'use client';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { Button } from './ui/button';
import { useContext, useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { isSolanaWallet } from '@dynamic-labs/solana';
import { ISolana } from '@dynamic-labs/solana-core';
import { PublicKey } from '@solana/web3.js';
import { Transaction } from '@solana/web3.js';
import { SystemProgram } from '@solana/web3.js';
import { Loader } from 'lucide-react';
import { createNewPrivateSale } from '@/app/actions';
import { toast } from 'sonner';
import PrivateSaleContext, {
  privateSaleContextType,
} from './privateSale/context/PrivateSaleContext';
import { set } from 'zod';

const ConnectWalletButton = () => {
  const {
    solValue,
    tokenValue,
    piWalletAddress,
    zodError,
    setRefetchBalance,
    setPiWalletAddress,
    setSolValue,
  } = useContext(PrivateSaleContext) as privateSaleContextType;

  const isConnected = useIsLoggedIn();

  const { primaryWallet, sdkHasLoaded, network } = useDynamicContext();

  const [walletBalance, setWalletBalance] = useState<string>('0');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [buttonText, setButtonText] = useState<
    'Buy Tokens' | 'Signing tx' | 'Sending SOL' | 'Confirming'
  >('Buy Tokens');

  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS as string;

  if (!treasuryAddress) {
    throw new Error(
      'NEXT_PUBLIC_TREASURY_ADDRESS is not defined in the environment variables'
    );
  }

  // 8Qm6YqtzrRZXNbghw4v79XqUC4rmkq9WrsGA2pQ3zMEG

  const getBalance = async () => {
    const balance = await primaryWallet?.getBalance();
    const handledBalance = balance ? Number(balance).toFixed(2) : '0';
    setWalletBalance(handledBalance);
    // console.log(balance);
    return balance;
  };

  useEffect(() => {
    if (isConnected && primaryWallet) {
      getBalance();
    }
  }, [isConnected, primaryWallet]);

  // useEffect(() => {
  //   console.log('network', network);
  //   console.log('primaryWallet', primaryWallet);
  // }, [isConnected]);

  const sendSolana = async () => {
    setButtonText('Signing tx');
    if (
      !primaryWallet ||
      !primaryWallet.address ||
      !isSolanaWallet(primaryWallet)
    ) {
      console.log('Not a solana wallet');
      setIsLoading(false);
      return;
    }

    try {
      const connection = primaryWallet.getConnection();

      const lastBlock = (await connection).getLatestBlockhash();

      const fromKey = new PublicKey(primaryWallet?.address);

      const toKey = new PublicKey(treasuryAddress);

      const solAmount = Number(solValue) * LAMPORTS_PER_SOL;

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKey,
          toPubkey: toKey,
          lamports: solAmount,
        })
      );

      tx.recentBlockhash = (await lastBlock).blockhash;

      tx.feePayer = fromKey;

      const signer: ISolana = await primaryWallet.getSigner();

      const signedTransaction = await signer.signTransaction(tx);

      // console.log('signedTransaction', signedTransaction);

      setButtonText('Sending SOL');

      const signature = await (
        await connection
      ).sendRawTransaction(signedTransaction.serialize());

      // console.log('signature', signature);

      // Poll for transaction confirmation
      const confirmTimeout = 60_000; // 1 minute timeout
      const startTime = Date.now();
      let isConfirmed = null;

      while (Date.now() - startTime < confirmTimeout) {
        isConfirmed = await (await connection).getSignatureStatus(signature);
        if (
          isConfirmed.value &&
          isConfirmed.value.confirmationStatus === 'confirmed'
        ) {
          console.log('Transaction confirmed');
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds

        console.log('Polling for confirmation', isConfirmed);
      } // end while

      setButtonText('Confirming');

      if (
        !isConfirmed?.value ||
        isConfirmed.value.confirmationStatus !== 'confirmed'
      ) {
        toast.error('Transaction failed');
        setIsLoading(false);
        return;
      }

      //  after transaction is confirmed,
      const saved = await createNewPrivateSale({
        walletAddress: primaryWallet.address,
        solanaValue: solValue,
        tokenValue: tokenValue,
        txHash: signature,
        piWalletAddress:
          piWalletAddress && piWalletAddress !== '' ? piWalletAddress : null,
      });

      if (saved) {
        setPiWalletAddress('');
        setSolValue('1');
      }

      toast.success('Transaction sent successfully');

      setRefetchBalance(true);

      setButtonText('Buy Tokens');
      getBalance();
    } catch (error) {
      toast.error('Transaction failed');
      console.log('error', error);
    } finally {
      setIsLoading(false);
      setButtonText('Buy Tokens');
    }
  };

  return (
    isConnected && (
      <Button
        className="rounded-none w-full bg-soft hover:bg-blueDarken text-foreground disabled:bg-blueDarken/80 text-lg flex-center gap-2 "
        size={'lg'}
        disabled={
          !sdkHasLoaded ||
          !isConnected ||
          isLoading ||
          !solValue ||
          !tokenValue ||
          tokenValue === '0' ||
          solValue === '0' ||
          zodError
        }
        onClick={() => sendSolana()}
      >
        {buttonText !== 'Buy Tokens' ? (
          <>
            <span> {buttonText} ... </span>
            <Loader className="w-4 h-4 animate-spin " />
          </>
        ) : (
          <>
            <span> {buttonText} </span>
            <span className="text-xs">{walletBalance.toString()} SOL</span>
          </>
        )}
      </Button>
    )
  );
};
export default ConnectWalletButton;
