/*
  Warnings:

  - You are about to drop the column `quantity` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `_ItemToOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ItemToOrder" DROP CONSTRAINT "_ItemToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToOrder" DROP CONSTRAINT "_ItemToOrder_B_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "OrderItem" JSONB[];

-- DropTable
DROP TABLE "_ItemToOrder";
