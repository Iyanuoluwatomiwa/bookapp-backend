/*
  Warnings:

  - You are about to drop the column `userName` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "profiles_userName_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "userName";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "userName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");
