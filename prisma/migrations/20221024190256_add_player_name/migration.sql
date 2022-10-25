/*
  Warnings:

  - Added the required column `sumName` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerStat" ADD COLUMN     "sumName" TEXT NOT NULL;
