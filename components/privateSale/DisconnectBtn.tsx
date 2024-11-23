"use client";

import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
// import { useAccount, useDisconnect } from "wagmi";
import { Button } from "../ui/button";

const DisconnectBtn = () => {
  const isConnected = useIsLoggedIn();
  const { handleLogOut } = useDynamicContext();
  return (
    isConnected && (
      <Button
        size={"sm"}
        variant={"link"}
        className="rounded-none text-accent p-0 m-0 h-full"
        onClick={() => handleLogOut()}
      >
        Disconnect
      </Button>
    )
  );
};
export default DisconnectBtn;
