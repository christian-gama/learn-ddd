/*
  Warnings:

  - Added the required column `isActive` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "isActive" BOOLEAN NOT NULL;

-- CreateIndex
CREATE INDEX "Item_isActive_idx" ON "Item"("isActive");
