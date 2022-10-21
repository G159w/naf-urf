/*
  Warnings:

  - A unique constraint covering the columns `[gameId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ign]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_periodId_fkey";

-- DropForeignKey
ALTER TABLE "Stat" DROP CONSTRAINT "Stat_championStatId_fkey";

-- DropForeignKey
ALTER TABLE "Stat" DROP CONSTRAINT "Stat_periodId_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "gameId" INTEGER NOT NULL,
ADD COLUMN     "gameLoaded" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "periodId" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Stat" ALTER COLUMN "championStatId" DROP NOT NULL,
ALTER COLUMN "periodId" DROP NOT NULL,
ALTER COLUMN "kills" DROP NOT NULL,
ALTER COLUMN "deaths" DROP NOT NULL,
ALTER COLUMN "assists" DROP NOT NULL,
ALTER COLUMN "damage" DROP NOT NULL,
ALTER COLUMN "reduction" DROP NOT NULL,
ALTER COLUMN "kda" DROP NOT NULL,
ALTER COLUMN "perf" DROP NOT NULL,
ALTER COLUMN "xClass" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_gameId_key" ON "Game"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_ign_key" ON "User"("ign");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_championStatId_fkey" FOREIGN KEY ("championStatId") REFERENCES "ChampionStat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE SET NULL ON UPDATE CASCADE;
