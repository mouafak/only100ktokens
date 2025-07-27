'use client';
import { use, useContext, useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import PrivateSaleContext, {
  PrivateSaleContextType,
} from './context/PrivateSaleContext';
import { useIsLoggedIn } from '@dynamic-labs/sdk-react-core';

const PiInput = () => {
  const isConnected = useIsLoggedIn();
  const [canAddPiWalletAddress, setCanAddPiWalletAddress] = useState(false);
  const { piWalletAddress, setPiWalletAddress, solValue } = useContext(
    PrivateSaleContext
  ) as PrivateSaleContextType;

  const onChangeHandler = (e: any) => {
    setPiWalletAddress(e.target.value);
  };

  useEffect(() => {
    if (solValue && Number(solValue) >= 1) {
      setCanAddPiWalletAddress(true);
    } else {
      setCanAddPiWalletAddress(false);
      setPiWalletAddress('');
    }
  }, [solValue]);

  useEffect(() => {
    if (!isConnected) {
      setPiWalletAddress('');
    }
  }, [isConnected]);

  return (
    <div className="pt-2">
      <Label> Your PI wallet address </Label>
      <Input
        type="text"
        className=" bg-soft  rounded-none border-none placeholder:text-xs"
        placeholder="Insert Your Pi Address Wallet here ..."
        disabled={!isConnected || !canAddPiWalletAddress}
        value={piWalletAddress}
        onChange={onChangeHandler}
      />
      <div className="text-[8px] mt-2 text-muted-foreground">
        {/* you should purchase minimum 1 sol to get your pi gift  */}
        <p>
          Join our private sale and earn PI Network tokens! Every day, more than
          10 participants will receive PI tokens. To participate, you must
          contribute a minimum of 1 SOL and provide your PI wallet address.
        </p>
      </div>
    </div>
  );
};
export default PiInput;
