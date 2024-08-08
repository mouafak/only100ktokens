"use client";
import React from "react";
import { Button } from "../ui/button";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { Loader } from "lucide-react";
import { useAccount } from "wagmi";

const ConnectButton = () => {
  const { open } = useWeb3Modal();
  const { loading, open: isOpen } = useWeb3ModalState();
  const { isConnected, address } = useAccount();
  return (
    <div>
      {!isConnected ? (
        <Button
          onClick={() => {
            open();
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
          onClick={() => {
            open();
          }}
          className="rounded-none w-full bg-custom-blue hover:bg-custom-blue-green "
        >
          Pay Now TRTR
        </Button>
      )}
    </div>
  );
};

export default ConnectButton;
