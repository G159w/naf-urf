/*
  Warnings:

  - You are about to drop the column `support` on the `ChampionStat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Champion" ADD COLUMN     "support" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ChampionStat" DROP COLUMN "support";
