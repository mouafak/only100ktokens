"use server";

import prisma from "@/prisma";
import { Prisma, PrivateSale } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createNewPrivateSale = async ({
  walletAddress,
  solanaValue,
  tokenValue,
  txHash,
  piWalletAddress = null,
}: {
  walletAddress: string;
  solanaValue: string;
  tokenValue: string;
  txHash: string;
  piWalletAddress: string | null;
}) => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  if (solanaValue == "0" || solanaValue == "0") {
    throw new Error("Solana value is required");
  }

  const res = await prisma.privateSale.create({
    data: {
      walletAddress,
      solanaValue,
      tokenValue,
      txHash,
      piWalletAddress,
    },
  });

  revalidatePath("/app/page.tsx", "page");

  return res;
};

export const getBalanceByWaleltAddress = async (walletAddress: string) => {
  return await prisma.privateSale.findMany({
    where: {
      walletAddress,
    },
  });
};
