"use client";
import { ChangeEvent, useContext, useState } from "react";
import { z } from "zod";
import { Input } from "../ui/input";
import PrivateSaleContext, {
  privateSaleContextType,
} from "./context/PrivateSaleContext";
import Image from "next/image";
import EthereumLogo from "../../public/ethereum_logo.png";

const EthInput = () => {
  const [zodError, setZodError] = useState("");
  // const [ethValue, setEthValue] = useState(0);

  const { ethValue, setEthValue } = useContext(
    PrivateSaleContext
  ) as privateSaleContextType;

  const schema = z
    .number({
      required_error: "ETH quantity required",
      invalid_type_error: "The input is invalid",
    })
    .min(0.001, {
      message: "ETH amount must be greater than 0.001",
    });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^\d*\.?\d{0,4}$/;
    const ethVal = e.target?.value;
    const zodParseResult = schema.safeParse(Number(ethVal));
    if (!zodParseResult.success) {
      setZodError(zodParseResult.error?.issues[0].message || "");
      console.log(zodParseResult.error?.issues[0].message);
    } else {
      setZodError("");
    }

    if (regex.test(ethVal)) {
      setEthValue(ethVal);
      console.log(ethVal);
    }
  };
  return (
    <div className=" relative flex flex-col bg-custom-blue p-2">
      <span className="text-white text-sm font-semibold">You pay</span>
      <Input
        onChange={onChangeHandler}
        value={Number(ethValue)}
        autoComplete="off"
        autoCorrect="off"
        minLength={1}
        maxLength={10}
        placeholder="0.001"
        pattern="^\d*\.?\d{0,2}$"
        type="number"
        inputMode="decimal"
        className=" h-16 m-0 bg-custom-blue rounded-none text-white text-3xl font-medium outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <p className="text-xs text-red-200 h-4 absolute bottom-1 ">{zodError}</p>
      <Image
        src={EthereumLogo}
        alt="logo"
        width={48}
        height={48}
        className="top-1/2 -translate-y-1/2 right-1 absolute"
      />
    </div>
  );
};

export default EthInput;
