/*
  Warnings:

  - Made the column `lastname` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `Driver` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "lastname" SET NOT NULL;

-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "lastname" SET NOT NULL;
