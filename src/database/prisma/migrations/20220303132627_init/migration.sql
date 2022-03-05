-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `emailVerficationToken` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `token` VARCHAR(255) NOT NULL,
    `token_expires_at` BIGINT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `emailVerficationToken_id_key`(`id`),
    UNIQUE INDEX `emailVerficationToken_token_key`(`token`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `emailVerficationToken` ADD CONSTRAINT `userss_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
