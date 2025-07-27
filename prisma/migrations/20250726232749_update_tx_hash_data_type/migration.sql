/*
  Warnings:

  - A unique constraint covering the columns `[txHash]` on the table `ClaimTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `ClaimTransaction_walletAddress_key` ON `claimtransaction`;

-- AlterTable
ALTER TABLE `claimtransaction` MODIFY `txHash` VARCHAR(88) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ClaimTransaction_txHash_key` ON `ClaimTransaction`(`txHash`);
