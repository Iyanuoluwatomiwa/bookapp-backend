/*
  Warnings:

  - You are about to drop the column `email` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[description]` on the table `books` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bio` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "books_email_key";

-- DropIndex
DROP INDEX "categories_email_key";

-- DropIndex
DROP INDEX "profiles_email_key";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "price" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "email",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "books_description_key" ON "books"("description");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
