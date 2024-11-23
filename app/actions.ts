"use server";

import prisma from "@/prisma";
import { Prisma, Privatesale } from "@prisma/client";
import { revalidatePath } from "next/cache";

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

  const res = await prisma.privatesale.create({
    data: {
      walletAddress,
      solanaValue,
      mskValue,
      txHash,
    },
  });

  revalidatePath("/app/page.tsx", "page");

  return res;
};

export const getBalanceByWaleltAddress = async (walletAddress: string) => {
  return await prisma.privatesale.findMany({
    where: {
      walletAddress,
    },
  });
};
