import React from "react";
import SolanaInput from "./SolanaInput";
import TokenInput from "./TokenInput";
import { ArrowRight } from "lucide-react";
import PrivateSaleProvider from "./PrivateSaleProvider";
import ConnectButton from "./ConnectButton";
import { Separator } from "../ui/separator";
import Balance from "./Balance";
import DisconnectBtn from "./DisconnectBtn";
import BuyButton from "@/components/BuyButton";
import CountdownTimer from "../Countdown";
import Image from "next/image";
import Only100KLogo from "@/public/100kLogoBLue.png";
import PiInput from "./PiInput";

const PrivateSaleForm = () => {
  return (
    <PrivateSaleProvider>
      <div className="w-96 p-1 flex flex-col gap-2">
        <div className=" bg-blueSombre">
          <CountdownTimer targetDate="2024-11-28T23:59:59" />
        </div>
        <div className="w-full h-full bg-blueSombre p-6 flex flex-col justify-between gap-4">
          <div className="flex-center flex-col">
            <p className="text-sm uppercase">Private Sale</p>
            <Image className="w-32 lg:w-44" src={Only100KLogo} alt="Logo" />
            <div>
              <p className="text-custom-blue-green text-center text-xs font-semibold text-gold ">
                More than 10K PI tokens to earn <br />
                <span className="">you contribute 1 SOL you earn 1 PI</span>
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
    </PrivateSaleProvider>
  );
};

export default PrivateSaleForm;
