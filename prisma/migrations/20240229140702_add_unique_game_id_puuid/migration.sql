/*
  Warnings:

  - A unique constraint covering the columns `[gameId,puuid]` on the table `PlayerStat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlayerStat_gameId_puuid_key" ON "PlayerStat"("gameId", "puuid");
