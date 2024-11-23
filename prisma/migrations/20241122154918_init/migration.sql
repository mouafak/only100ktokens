-- CreateTable
CREATE TABLE `Privatesale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `walletAddress` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL DEFAULT '10000',
    `solanaValue` VARCHAR(191) NOT NULL,
    `mskValue` VARCHAR(191) NOT NULL,
    `txHash` MEDIUMTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Privatesale_walletAddress_key`(`walletAddress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
