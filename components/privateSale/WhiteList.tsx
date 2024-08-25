"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const WhiteList = () => {
  const { isConnected, address } = useAccount();
  const whiteListAccounts = process.env.NEXT_PUBLIC_WHITELIST as string;
  const whiteListArray = whiteListAccounts.split(",");
  const [isWhiteListed, setWhiteListed] = useState(false);
  console.log(whiteListArray);

  useEffect(() => {
    if (isConnected && address && whiteListArray.includes(address)) {
      setWhiteListed(true);
    } else {
      setWhiteListed(false);
    }
    console.log(isWhiteListed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, whiteListAccounts]);

  return (
    isWhiteListed && (
      <div className="h-10 flex-center bg-custom-yellow text-custom-blue-green text-sm font-semibold relative">
        <p className="animate-ping text-xs"> WHITE LISTED 3X </p>
        <p className="absolute"> WHITE LISTED 3X </p>
      </div>
    )
  );
};
export default WhiteList;
