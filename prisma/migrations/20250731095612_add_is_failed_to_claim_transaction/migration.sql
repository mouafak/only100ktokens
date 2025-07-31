-- AlterTable
ALTER TABLE `ClaimTransaction`
ADD COLUMN `isFailed` BOOLEAN NOT NULL DEFAULT false;