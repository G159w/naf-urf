/*
  Warnings:

  - You are about to drop the column `gameId` on the `Stat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playerStatId]` on the table `Stat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playerStatId` to the `Stat` table without a default value. This is not possible if the table is not empty.
  - Made the column `championStatId` on table `Stat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `periodId` on table `Stat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `kills` on table `Stat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deaths` on table `Stat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `assists` on table `Stat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `damage` on table `Stat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reduction` on table `Stat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `kda` on table `Stat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `perf` on table `Stat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `xClass` on table `Stat` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Stat" DROP CONSTRAINT "Stat_championStatId_fkey";

-- DropForeignKey
ALTER TABLE "Stat" DROP CONSTRAINT "Stat_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Stat" DROP CONSTRAINT "Stat_periodId_fkey";

-- DropIndex
DROP INDEX "Stat_userId_gameId_key";

-- AlterTable
ALTER TABLE "Stat" DROP COLUMN "gameId",
ADD COLUMN     "playerStatId" INTEGER NOT NULL,
ALTER COLUMN "championStatId" SET NOT NULL,
ALTER COLUMN "periodId" SET NOT NULL,
ALTER COLUMN "kills" SET NOT NULL,
ALTER COLUMN "deaths" SET NOT NULL,
ALTER COLUMN "assists" SET NOT NULL,
ALTER COLUMN "damage" SET NOT NULL,
ALTER COLUMN "reduction" SET NOT NULL,
ALTER COLUMN "kda" SET NOT NULL,
ALTER COLUMN "perf" SET NOT NULL,
ALTER COLUMN "xClass" SET NOT NULL;

-- CreateTable
CREATE TABLE "LolRequest" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LolRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stat_playerStatId_key" ON "Stat"("playerStatId");

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_championStatId_fkey" FOREIGN KEY ("championStatId") REFERENCES "ChampionStat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_playerStatId_fkey" FOREIGN KEY ("playerStatId") REFERENCES "PlayerStat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
