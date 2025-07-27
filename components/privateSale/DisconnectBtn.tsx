"use client";

import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
// import { useAccount, useDisconnect } from "wagmi";
import { Button } from "../ui/button";
import { useContext } from "react";
import PrivateSaleContext, {
  PrivateSaleContextType,
} from "./context/PrivateSaleContext";

const DisconnectBtn = () => {
  const isConnected = useIsLoggedIn();
  const { handleLogOut } = useDynamicContext();
  const { setRefetchBalance } = useContext(
    PrivateSaleContext
  ) as PrivateSaleContextType;
  return (
    isConnected && (
      <Button
        size={"sm"}
        variant={"link"}
        className="rounded-none text-accent p-0 m-0 h-full"
        onClick={async () => {
          await handleLogOut();
          setRefetchBalance(true);
        }}
      >
        Disconnect
      </Button>
    )
  );
};
export default DisconnectBtn;
