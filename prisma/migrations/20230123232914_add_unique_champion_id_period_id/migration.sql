/*
  Warnings:

  - A unique constraint covering the columns `[championId,periodId]` on the table `ChampionStat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChampionStat_championId_periodId_key" ON "ChampionStat"("championId", "periodId");
