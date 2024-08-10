"use client";
import React, { useContext, useEffect } from "react";
import { Button } from "../ui/button";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { Loader } from "lucide-react";
import { useAccount, useReadContract, useSendTransaction } from "wagmi";
import { Address, formatEther, parseEther } from "viem";
import PrivateSaleContext, {
  privateSaleContextType,
} from "./context/PrivateSaleContext";
import { toast } from "sonner";
import { privateSaleAbi } from "./abi/abi";

const ConnectButton = () => {
  const { open } = useWeb3Modal();
  const { loading, open: isOpen } = useWeb3ModalState();
  const { isConnected, address } = useAccount();
  const { data: hash, sendTransaction, isPending } = useSendTransaction();
  const { ethValue } = useContext(PrivateSaleContext) as privateSaleContextType;
  const { setYourBalance } = useContext(
    PrivateSaleContext
  ) as privateSaleContextType;

  const {
    data: balance,
    isLoading: balanceIsLoading,
    refetch: refetchBalance,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_PRIVATE_SALE_SMART_CONTRACT as Address,
    abi: privateSaleAbi,
    functionName: "getUserTokenBalance",
    args: [`${address}`],
  });

  useEffect(() => {
    if (balance && typeof balance === "bigint") {
      setYourBalance(String(formatEther(balance) || "0"));
    }
  }, [balance]);

  console.log("balance", balance);

  return (
    <div>
      {!isConnected ? (
        <Button
          onClick={() => {
            if (!isConnected) {
              open();
            }
          }}
          className="rounded-none w-full bg-custom-blue hover:bg-custom-blue-green  "
        >
          {loading || isOpen ? (
            <Loader className="w-4 h-4 animate-spin " />
          ) : (
            "Connect Wallet"
          )}
        </Button>
      ) : (
        <Button
          disabled={
            !isConnected ||
            isPending ||
            parseEther(ethValue || "0") < parseEther("0.02")
          }
          onClick={() => {
            if (isConnected) {
              if (Number(ethValue) <= 0) {
                toast("TRUMP’S TRIUMPH", {
                  description: " Minimum is 0.02 ETH ",
                });
                return;
              }
              if (parseEther(ethValue) < parseEther("0.02")) {
                return;
              }
              sendTransaction(
                {
                  to: process.env
                    .NEXT_PUBLIC_PRIVATE_SALE_SMART_CONTRACT as Address,
                  value: parseEther(ethValue || "0"),
                  data: "0x",
                },
                {
                  onSuccess: () => {
                    toast("TRUMP’S TRIUMPH", {
                      description: "Payment Successful",
                    });
                  },
                  onError: (error) => {
                    toast("TRUMP’S TRIUMPH", {
                      description: "Payment Failed",
                    });
                  },
                  onSettled: () => {
                    setTimeout(() => {
                      refetchBalance();
                    }, 5000);
                  },
                }
              );
            }
          }}
          className="rounded-none w-full bg-custom-blue hover:bg-custom-blue-green "
        >
          {isPending ? (
            <div className="flex-center gap-1">
              <Loader className="w-4 h-4 stroke-white animate-spin " />
              <span> pending </span>
            </div>
          ) : (
            "Pay Now TRTR"
          )}
        </Button>
      )}
    </div>
  );
};

export default ConnectButton;
