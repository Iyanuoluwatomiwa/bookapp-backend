/*
  Warnings:

  - You are about to drop the column `price` on the `books` table. All the data in the column will be lost.
  - Added the required column `priceRequest` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" DROP COLUMN "price",
ADD COLUMN     "priceRequest" TEXT NOT NULL;
