/*
  Warnings:

  - You are about to drop the column `accpeted_cookie_tracking` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "accpeted_cookie_tracking",
ADD COLUMN     "accepted_cookie_tracking" BOOLEAN NOT NULL DEFAULT false;
