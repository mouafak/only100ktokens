"use client";
import { ChangeEvent, useContext, useState } from "react";
import { z } from "zod";
import { Input } from "../ui/input";
import PrivateSaleContext, {
  privateSaleContextType,
} from "./context/PrivateSaleContext";
import Image from "next/image";
import SolanaLogo from "@/public/solanaLogo.png";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
// import { useAccount, useBalance } from "wagmi";

const SolanaInput = () => {
  const [zodError, setZodError] = useState("");
  const isConnected = useIsLoggedIn();

  const {
    solValue,
    setSolValue,
    setZodError: setZodErrorContext,
  } = useContext(PrivateSaleContext) as privateSaleContextType;

  const solMinValue = process.env.NODE_ENV == "development" ? 0.01 : 0.4;

  const schema = z
    .number({
      required_error: "SOL quantity required",
      invalid_type_error: "The input is invalid",
    })
    .min(solMinValue, {
      message: `SOLANA amount must be greater than ${solMinValue} SOL`,
    });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^\d*\.?\d{0,4}$/;
    const solVal = e.target?.value;
    const zodParseResult = schema.safeParse(Number(solVal));
    if (!zodParseResult.success) {
      setZodError(zodParseResult.error?.issues[0].message || "");
      console.log(zodParseResult.error?.issues[0].message);
      setZodErrorContext(true);
    } else {
      setZodError("");
      setZodErrorContext(false);
    }

    if (regex.test(solVal)) {
      setSolValue(solVal);
    }
  };
  return (
    <div className=" relative flex flex-col bg-soft p-2 h-24">
      <div className="flex-center justify-between mb-2">
        <span className="text-white text-sm font-semibold">You pay</span>
        <span className="text-xs font-semibold">1 SOL = 1 000 000 MSK</span>
      </div>
      <Input
        disabled={!isConnected}
        onChange={onChangeHandler}
        value={solValue}
        autoComplete="off"
        autoCorrect="off"
        //minLength={1}
        //maxLength={10}
        placeholder="0.02"
        pattern="^\d*\.?\d{0,2}$"
        type="number"
        inputMode="decimal"
        className=" h-16 m-0 bg-transparent rounded-none text-white text-2xl font-medium outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <p className="text-xs text-red-200 h-4 absolute bottom-1 ">{zodError}</p>
      <Image
        src={SolanaLogo}
        alt="logo"
        className="top-2/3 -translate-y-2/3 right-4 absolute bg-blueDark p-2 w-10 h-10 "
      />
      <div className=" absolute top-2/3 -translate-y-2/3 right-16 text-white ">
        {/* <span
          // onClick={setMax}
          className="bg-custom-yellow py-.5 px-1 text-custom-blue text-sm hover:cursor-pointer hover:bg-custom-blue-green hover:text-white "
        >
          max
        </span> */}
      </div>
    </div>
  );
};

export default SolanaInput;
