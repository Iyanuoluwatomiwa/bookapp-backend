/*
  Warnings:

  - Added the required column `userName` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "userName" TEXT NOT NULL;
