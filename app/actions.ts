"use server";

import prisma from "@/prisma";
import { Prisma, PrivateSale } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress, TokenAccountNotFoundError, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import base58 from "bs58";
import { EXCLUDED_WALLETS } from "@/constant/excluded-wallets";

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

export const getBalanceByWalletAddress = async (walletAddress: string) => {
  return await prisma.privateSale.findMany({
    where: {
      walletAddress,
    },
  });
};

// update a private sale transaction by wallet address => set balance to 0
export const updatePrivateSaleSetBalanceZero = async (
  walletAddress: string
) => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  const res = await prisma.privateSale.updateMany({
    where: {
      walletAddress,
    },
    data: {
      solanaValue: "0",
      tokenValue: "0",
    },
  });

  revalidatePath("/app/page.tsx", "page");

  return res;
};

// get the total solana and token balance for a given wallet address, solanaValue and tokenValue are strings so we need to convert them to numbers 
export const getSolanaAndTokenBalance = async (walletAddress: string) => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }
  const privateSales = await prisma.privateSale.findMany({
    where: {
      walletAddress,
    },
  });

  if (!privateSales || privateSales.length === 0) {
    return { solanaBalance: "0", tokenBalance: "0" };
  }

  const solanaBalance = privateSales.reduce((acc, sale) => acc + parseFloat(sale.solanaValue), 0).toFixed(2);
  const tokenBalance = privateSales.reduce((acc, sale) => acc + parseFloat(sale.tokenValue), 0).toFixed(2);
  return { solanaBalance, tokenBalance };
}


// create a new  claim transaction row in the database
export const createClaimTransaction = async (
  {
    walletAddress,
    solanaValue,
    feeAmount,
    tokenValue,
    txHash,

  }: {
    walletAddress: string;
    solanaValue: string;
    feeAmount: string;
    tokenValue: string;
    txHash: string;
  }
) => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  if (!(parseFloat(tokenValue) > 0)) {
    throw new Error("Token value is required");
  }

  const res = await prisma.claimTransaction.create({
    data: {
      walletAddress,
      solanaValue,
      feeAmount,
      tokenValue,
      txHash,
      isConfirmed: false, // Initially set to false, will be updated after confirmation
    },
  });

  return res;
}

// get a claim transaction by wallet address
export const getClaimTransactionByWalletAddress = async (walletAddress: string) => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  const claimTransactions = await prisma.claimTransaction.findMany({
    where: {
      walletAddress,
    },
  });

  return claimTransactions;
};

//  get unconfirmed claim transactions by wallet address
export const getUnconfirmedClaimTransactionsByWalletAddress = async (walletAddress: string) => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  const unconfirmedClaims = await prisma.claimTransaction.findMany({
    where: {
      walletAddress,
      isConfirmed: false,
    },
  });

  return unconfirmedClaims;
};

// get the total claimed tokens for a given wallet address
export const getTotalClaimedTokensByWalletAddress = async (walletAddress: string) => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  const claimedTokens = await prisma.claimTransaction.findMany({
    where: {
      walletAddress,
      isConfirmed: true,
    },
  });

  const totalClaimed = claimedTokens.reduce((acc, token) => {
    return acc + parseFloat(token.tokenValue);
  }, 0);

  return totalClaimed.toFixed(2);
};

// update a claim transaction isConfirmed by wallet address
// export const updateClaimTransactionIsConfirmed = async (
//   {
//     walletAddress,
//     isConfirmed,
//   }: {
//     walletAddress: string;
//     isConfirmed: boolean;
//   }
// ) => {
//   if (!walletAddress) {
//     throw new Error("Wallet address is required");
//   }

//   const claimTransaction = await prisma.claimTransaction.update({
//     where: {
//       walletAddress,
//     },
//     data: {
//       isConfirmed,
//     },
//   });

//   return claimTransaction;
// };

// update a claim transaction by txHash
export const updateClaimTransactionByTxHashSetConfirmed = async (
  {
    txHash,
    isConfirmed,
  }: {
    txHash: string;
    isConfirmed: boolean;
  }
) => {
  if (!txHash) {
    throw new Error("Transaction hash is required");
  }

  const claimTransaction = await prisma.claimTransaction.update({
    where: {
      txHash,
    },
    data: {
      isConfirmed,
    },
  });

  return claimTransaction;
};

// Function to prepare the the transaction

export const prepareTransaction = async (
  {
    userWallet,
  }: {
    userWallet: string;
  }
) => {

  try {

    if (!process.env.TOKEN_TREASURY_PRIVATE_KEY) throw new Error("TOKEN_TREASURY_PRIVATE_KEY is not defined in the environment variables");
    if (!process.env.TOKEN_TREASURY_TOKEN_ACCOUNT) throw new Error("TOKEN_TREASURY_TOKEN_ACCOUNT is not defined in the environment variables");
    if (!process.env.TOKEN_MINT_ADDRESS) throw new Error("TOKENS_MINT_ADDRESS is not defined in the environment variables");
    if (!userWallet) throw new Error("User wallet address is required");
    if (!process.env.FEES_TREASURY_ADDRESS) throw new Error("FEES_TREASURY_ADDRESS is not defined in the environment variables");
    if (!process.env.SOLANA_RPC_URL) throw new Error("SOLANA_RPC_URL is not defined in the environment variables");

    const { solanaBalance, tokenBalance } = await getSolanaAndTokenBalance(userWallet);

    // if solana balance is equal to 0 or token balance is equal to 0, that means the user has not participated in the private sale yet, so we throw an error
    if (solanaBalance === "0" || tokenBalance === "0") {
      return {
        success: false,
        errorType: "notParticipated",
        message: "You have not participated in the private sale yet",
      };
    }
    // Convert the balances to numbers and claculate 14% from the solana balance
    const solanaValue = parseFloat(solanaBalance);
    const claimAmount = parseFloat(tokenBalance);
    const feeAmount = solanaValue * 0.14; // 14% of the solana balance
    if (claimAmount <= 0 || feeAmount <= 0) {
      return {
        success: false,
        errorType: "invalidBalance",
        message: "Invalid balance for claim or fee amount",
      };
    }

    console.log("User wallet:", userWallet);
    console.log("Solana balance:", solanaValue);
    console.log("Claim amount:", claimAmount);
    console.log("Fee amount:", feeAmount);

    const connection = new Connection(
      process.env.SOLANA_RPC_URL
    )
    const tokenTreasuryKeypair = Keypair.fromSecretKey(
      base58.decode(process.env.TOKEN_TREASURY_PRIVATE_KEY)
    )
    // Get the treasury wallet public key
    const tokenTreasuryPublicKey = tokenTreasuryKeypair.publicKey;

    // fees wallet treasury
    const feesTreasuryPublicKey = new PublicKey(process.env.FEES_TREASURY_ADDRESS);

    // Convert userWallet to PublicKey
    const userPubkey = new PublicKey(userWallet);
    // token mint public key
    const tokenMintPubkey = new PublicKey(process.env.TOKEN_MINT_ADDRESS);

    console.log("Preparing transaction for user:", userWallet);
    console.log("Token amount to claim:", claimAmount);
    console.log("Fee amount to pay:", feeAmount);

    // Create a transaction
    const transaction = new Transaction();

    // 1. INSTRUCTION: Fee of claiming tokens SOL to sign by user
    if (!EXCLUDED_WALLETS.includes(userWallet)) {
      const feeInstruction = SystemProgram.transfer({
        fromPubkey: userPubkey,
        toPubkey: feesTreasuryPublicKey,
        lamports: Math.floor(feeAmount * LAMPORTS_PER_SOL), // Adjust the amount as needed
      });
      transaction.add(feeInstruction);
    }

    // 2. Verify if the user has an associated token account
    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMintPubkey,
      userPubkey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    let userTokenAccountExists = false;
    try {
      const accountInfo = await connection.getAccountInfo(userTokenAccount);
      userTokenAccountExists = accountInfo !== null;
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        console.error("User token account does not exist:", error);
        userTokenAccountExists = false;
      } else {
        throw error;
      }
    }

    // 3. Create the associated token account if it does not exist
    if (!userTokenAccountExists) {
      const createUserTokenAccountInstruction = createAssociatedTokenAccountInstruction(
        userPubkey,
        userTokenAccount,
        userPubkey,
        tokenMintPubkey,
        TOKEN_2022_PROGRAM_ID,
      );
      transaction.add(createUserTokenAccountInstruction);
      console.log("Created associated token account for user");
    }

    // 4. Create the transfer instruction to transfer tokens from treasury to user signed by treasury

    const tokenTreasuryTokenAccount = new PublicKey(process.env.TOKEN_TREASURY_TOKEN_ACCOUNT);

    // const tokenTreasuryTokenAccount = await getAssociatedTokenAddress(
    //   tokenMintPubkey,
    //   tokenTreasuryPublicKey,
    //   false,
    //   TOKEN_2022_PROGRAM_ID
    // );

    // Check if the treasury token account exists and get its balance
    console.log("Treasury token account:", tokenTreasuryTokenAccount.toString());

    const tokenTransferInstruction = createTransferInstruction(
      tokenTreasuryTokenAccount,
      userTokenAccount,
      tokenTreasuryPublicKey,
      claimAmount * Math.pow(10, 9),
      [], // No additional signers needed
      TOKEN_2022_PROGRAM_ID
    );
    transaction.add(tokenTransferInstruction);

    // 5. Define the metadata for the transaction
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = userPubkey;

    // 6. Partially sign the transaction with the treasury keypair
    transaction.partialSign(tokenTreasuryKeypair);
    console.log("Treasury keypair partially signed the transaction");

    // 7. Serialize the transaction for sending to the user
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false, // Allow partial signing
    });
    console.log("Transaction prepared and serialized");

    return {
      success: true,
      serializedTransaction: Buffer.from(serializedTransaction).toString("base64"),
      message: "Transaction prepared successfully",
    }


  } catch (error) {
    console.error("Error preparing transaction:", error);
    return {
      success: false,
      message: "Failed to prepare transaction",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }

}

export const submitTransaction = async (
  {
    serializedTransaction,
    userWallet,
  }: {
    serializedTransaction: string;
    userWallet: string;
  }
) => {
  try {
    if (!serializedTransaction || !userWallet) {
      throw new Error("Serialized transaction and user wallet are required");
    }
    // Create a connection to the Solana
    const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com");

    // Deserialize the transaction
    const transaction = Transaction.from(Buffer.from(serializedTransaction, "base64"));
    console.log("Deserialized transaction:", transaction);

    // send the transaction
    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: "confirmed",
        // maxRetries: 3,
      }
    );

    // wait for confirmation
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');

    if (confirmation.value.err) {
      throw new Error("Transaction failed to confirm");
    }

    console.log("Transaction confirmed with signature:", signature);

    return {
      success: true,
      signature,
      message: "Transaction submitted and confirmed successfully",
      confirmed: true,
    };

  } catch (error) {
    console.error("Error submitting transaction:", error);
    return {
      success: false,
      message: "Failed to submit transaction",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
