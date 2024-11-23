"use server";

import prisma from "@/prisma";
import { Prisma, Privatesale } from "@prisma/client";

export const createNewPrivateSale = async ({
  walletAddress,
  solanaValue,
  mskValue,
  txHash,
}: {
  walletAddress: string;
  solanaValue: string;
  mskValue: string;
  txHash: string;
}) => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  if (solanaValue == "0" || solanaValue == "0") {
    throw new Error("Solana value is required");
  }

  return await prisma.privatesale.create({
    data: {
      walletAddress,
      solanaValue,
      mskValue,
      txHash,
    },
  });
};
