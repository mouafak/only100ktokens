import React from 'react';
import SolanaInput from './SolanaInput';
import TokenInput from './TokenInput';
import { AlertCircle, ArrowRight } from 'lucide-react';
import PrivateSaleProvider from './PrivateSaleProvider';
import ConnectButton from './ConnectButton';
import { Separator } from '../ui/separator';
import Balance from './Balance';
import DisconnectBtn from './DisconnectBtn';
import BuyButton from '@/components/BuyButton';
import CountdownTimer from '../Countdown';
import Image from 'next/image';
import Only100KLogo from '@/public/100kLogoBLue.png';
import PiInput from './PiInput';
import ClaimButton from '../claim-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '../ui/input';
import TokenAmount from '../claim/token-amount';
import ClaimFees from '../claim/claim-fees';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const PrivateSaleForm = () => {
  return (
    <PrivateSaleProvider>
      <Tabs defaultValue="privateSale" className="w-96">
        <TabsList className="justify-between bg-blueSombre rounded-none w-96 p-0">
          <TabsTrigger
            value="privateSale"
            className="w-full data-[state=active]:!bg-blue-500 data-[state=active]:text-white data-[state=active]:border-none data-[state=active]:rounded-none uppercase"
          >
            Private Sale
          </TabsTrigger>
          <TabsTrigger
            value="claim"
            className="w-full data-[state=active]:!bg-blue-500 data-[state=active]:text-white data-[state=active]:border-none data-[state=active]:rounded-none uppercase"
          >
            Claim
          </TabsTrigger>
        </TabsList>
        <TabsContent value="privateSale" className="bg-blueSombre">
          <div className="w-full p-1 flex flex-col gap-2">
            <div className="w-full h-full bg-blueSombre p-6 flex flex-col justify-between gap-4">
              <div className="flex-center flex-col">
                <p className="text-xl uppercase">Private Sale</p>
                <Image
                  loading={'lazy'}
                  className="w-32 lg:w-44"
                  src={Only100KLogo}
                  alt="Logo"
                />
                <div>
                  <p className="text-custom-blue-green text-center text-xs font-semibold text-gold ">
                    ✨ More than 10K PI Network tokens to earn ✨ <br />
                    <span className="">
                      you contribute <span className="text-sm"> 1️⃣ </span> SOL
                      you earn <span className="text-sm"> 1️⃣ </span> PI
                    </span>
                  </p>
                </div>
              </div>
              <Balance />
              <div className="flex flex-col justify-center gap-1 relative">
                <SolanaInput />
                <TokenInput />
                <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-center bg-custom-yellow p-1 ">
                  <ArrowRight className=" w-5 h-5 rotate-90" />
                </div>
                <div>
                  <PiInput />
                </div>
              </div>
              <ConnectButton />
              <BuyButton />
              <DisconnectBtn />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="claim" className="bg-blueSombre">
          <div className="w-full h-full bg-blueSombre p-6 flex flex-col justify-between gap-4">
            <div className="flex-center flex-col">
              <p className="text-xl uppercase">Claim Your Tokens</p>
              <Image
                loading={'lazy'}
                className="w-32 lg:w-44"
                src={Only100KLogo}
                alt="Logo"
              />
              <div>
                <p className=" text-center text-xs text-gold/60 ">
                  To ensure successful token redemption, all participants must
                  maintain
                  <span className="font-medium px-1 uppercase text-gold">
                    ( 14% as fees )
                  </span>
                  of the Total purchase price Only100Ktokens in their wallet at
                  the time of claiming it.
                </p>
              </div>
              <div className="flex flex-col justify-center gap-1 relative w-full pt-4">
                <TokenAmount />
                <ClaimFees />
              </div>
            </div>

            <Alert className="bg-transparent p-0 border-none">
              <AlertTitle className="text-sm text-white flex items-center h-4">
                <AlertCircle className="inline-block mr-1 w-4 h-4 mb-0.5" />
                <span className="">Attention</span>
              </AlertTitle>
              <AlertDescription className="text-xs text-gold/60">
                The final day of the private sale will also be the last date on
                which tokens can be claimed. Following the deadline, any
                unclaimed or unredeemed tokens will be permanently burned.
              </AlertDescription>
            </Alert>

            <ConnectButton />
            <ClaimButton />
            <DisconnectBtn />
          </div>
        </TabsContent>
      </Tabs>
    </PrivateSaleProvider>
  );
};

export default PrivateSaleForm;
