/*
  Warnings:

  - Added the required column `order_id` to the `DriverReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `RestaurantReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DriverReview" ADD COLUMN     "order_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RestaurantReview" ADD COLUMN     "order_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "DriverReview_order_id_idx" ON "DriverReview"("order_id");

-- CreateIndex
CREATE INDEX "RestaurantReview_order_id_idx" ON "RestaurantReview"("order_id");

-- AddForeignKey
ALTER TABLE "RestaurantReview" ADD CONSTRAINT "RestaurantReview_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverReview" ADD CONSTRAINT "DriverReview_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
