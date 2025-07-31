-- CreateTable
CREATE TABLE `PrivateSale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `walletAddress` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL DEFAULT '0.1',
    `solanaValue` VARCHAR(191) NOT NULL,
    `tokenValue` VARCHAR(191) NOT NULL,
    `txHash` MEDIUMTEXT NOT NULL,
    `piWalletAddress` MEDIUMTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClaimTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `walletAddress` VARCHAR(191) NOT NULL,
    `solanaValue` VARCHAR(191) NOT NULL,
    `tokenValue` VARCHAR(191) NOT NULL,
    `feeAmount` VARCHAR(191) NOT NULL,
    `txHash` VARCHAR(88) NOT NULL,
    `isConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `isFailed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClaimTransaction_txHash_key`(`txHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
