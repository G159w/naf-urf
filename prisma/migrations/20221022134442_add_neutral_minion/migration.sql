/*
  Warnings:

  - Added the required column `neutralMinionsKilled` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerStat" ADD COLUMN     "neutralMinionsKilled" INTEGER NOT NULL;
