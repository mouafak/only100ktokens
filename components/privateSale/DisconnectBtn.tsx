"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Button } from "../ui/button";

const DisconnectBtn = () => {
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  return (
    isConnected && (
      <Button
        size={"sm"}
        variant={"link"}
        className="rounded-none text-custom-red p-0 m-0 h-full"
        onClick={() => disconnect()}
      >
        Disconnect
      </Button>
    )
  );
};
export default DisconnectBtn;
