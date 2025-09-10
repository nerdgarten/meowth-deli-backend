/*
  Warnings:

  - You are about to drop the column `is_verified` on the `Driver` table. All the data in the column will be lost.
  - The `status` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `is_verified` on the `Restaurant` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."VerificationStatus" AS ENUM ('pending', 'rejected', 'success');

-- AlterTable
ALTER TABLE "public"."Driver" DROP COLUMN "is_verified",
ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verification_status" "public"."VerificationStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "status",
ADD COLUMN     "status" "public"."VerificationStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "public"."Restaurant" DROP COLUMN "is_verified",
ADD COLUMN     "verification_status" "public"."VerificationStatus" NOT NULL DEFAULT 'pending';

-- DropEnum
DROP TYPE "public"."PaymentStatus";
