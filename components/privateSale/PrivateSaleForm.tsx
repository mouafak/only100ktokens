import React from "react";
import EthInput from "./EthInput";
import TrtrInput from "./TrtrInput";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import PrivateSaleProvider from "./PrivateSaleProvider";
import ConnectButton from "./ConnectButton";
import { Separator } from "../ui/separator";

const PrivateSaleForm = () => {
  return (
    <PrivateSaleProvider>
      <div className="w-96 h-[500px] p-1 drop-shadow-md ">
        <div className="w-full h-full bg-white p-6 flex flex-col justify-between">
          <div className="flex-center flex-col gap-2">
            <div className="grid grid-cols-3 w-full place-items-center ">
              <Separator className="bg-custom-blue h-[3px] " />
              <p className="text-xl font-bold uppercase text-custom-blue custom-shadow">
                Buy
              </p>
              <Separator className="bg-custom-blue h-[3px] " />
            </div>
            <h2 className=" text-2xl font-bold uppercase text-custom-blue custom-shadow ">
              TRUMP&rsquo;S TRIUMPH
            </h2>
            <div>
              <p className="text-custom-blue-green">
                The Meme Coin Supporting Donald Trump
              </p>
            </div>
            <Separator className="bg-custom-blue h-[3px] mt-2" />
          </div>
          {/* <div className="bg-custom-blue h-10"></div> */}
          <div className="flex flex-col justify-center gap-1 relative">
            {/* <Input className=" bg-custom-blue h-24 rounded-none text-white text-3xl font-medium" />
        < */}
            <EthInput />
            <TrtrInput />
            {/* <Input className=" bg-custom-blue h-24 rounded-none text-white text-3xl font-medium" /> */}
            <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-center bg-custom-yellow p-1 ">
              <ArrowRight className=" w-5 h-5 rotate-90" />
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </PrivateSaleProvider>
  );
};

export default PrivateSaleForm;
