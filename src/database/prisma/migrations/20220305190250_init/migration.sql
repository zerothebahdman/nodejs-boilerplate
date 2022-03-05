/*
  Warnings:

  - The `email_verified_at` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `token_expires_at` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `email_verified_at`,
    ADD COLUMN `email_verified_at` DATETIME(3) NULL,
    DROP COLUMN `token_expires_at`,
    ADD COLUMN `token_expires_at` DATETIME(3) NULL;
