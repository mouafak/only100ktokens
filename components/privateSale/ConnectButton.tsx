"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";

const ConnectButton = () => {
  const { setShowAuthFlow, setAuthMode, sdkHasLoaded } = useDynamicContext();
  const isConnected = useIsLoggedIn();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  return (
    <div>
      {!isConnected && (
        <Button
          onClick={() => setShowAuthFlow(true)}
          className="rounded-none w-full bg-soft hover:bg-secondary text-foreground disabled:bg-border text-lg "
          size={"lg"}
          disabled={!sdkHasLoaded}
        >
          {btnLoading ? (
            <Loader className="w-4 h-4 animate-spin " />
          ) : (
            "Connect Wallet"
          )}
        </Button>
      )}
    </div>
  );
};

export default ConnectButton;
