/*
  Warnings:

  - You are about to drop the column `OrderItem` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "OrderItem",
ADD COLUMN     "OrderItems" JSONB[];
