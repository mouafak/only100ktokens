"use client";
import {
  useDynamicContext,
  useIsLoggedIn,
  useSendBalance,
} from "@dynamic-labs/sdk-react-core";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const ConnectWalletButton = () => {
  const isConnected = useIsLoggedIn();

  const { primaryWallet, sdkHasLoaded, network } = useDynamicContext();

  const [walletBalance, setWalletBalance] = useState<string>("0");

  const getBalance = async () => {
    const balance = await primaryWallet?.getBalance();
    const handledBalance = balance ? Number(balance).toFixed(2) : "0";
    setWalletBalance(handledBalance);
    console.log(balance);
    return balance;
  };

  useEffect(() => {
    if (isConnected && primaryWallet) {
      getBalance();
    }
  }, [isConnected, primaryWallet]);

  useEffect(() => {
    console.log(network);
  }, [network]);

  return (
    isConnected && (
      <Button
        className="rounded-none w-full bg-soft hover:bg-secondary text-foreground disabled:bg-border text-lg flex-center gap-1 "
        size={"lg"}
        disabled={!sdkHasLoaded || !isConnected}
        onClick={() => {}}
      >
        <span>Buy MSK</span>
        <span className="text-xs">{walletBalance.toString()} SOL</span>
      </Button>
    )
  );
};
export default ConnectWalletButton;
