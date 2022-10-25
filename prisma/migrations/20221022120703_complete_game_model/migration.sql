/*
  Warnings:

  - You are about to drop the column `reduction` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to alter the column `damage` on the `PlayerStat` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[itemId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sumId]` on the table `SumSpells` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameMode` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doubleKills` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstBloodKill` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goldEarned` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item0` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item1` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item2` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item3` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item4` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item5` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item6` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mitigated` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pentaKills` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puuid` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quadraKills` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanked` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeCCingOthers` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalMinionsKilled` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTimeCCDealt` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTimeSpentDead` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripleKills` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `win` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sumId` to the `SumSpells` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "gameMode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "itemId" INTEGER NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PlayerStat" DROP COLUMN "reduction",
ADD COLUMN     "doubleKills" INTEGER NOT NULL,
ADD COLUMN     "firstBloodKill" INTEGER NOT NULL,
ADD COLUMN     "goldEarned" INTEGER NOT NULL,
ADD COLUMN     "item0" INTEGER NOT NULL,
ADD COLUMN     "item1" INTEGER NOT NULL,
ADD COLUMN     "item2" INTEGER NOT NULL,
ADD COLUMN     "item3" INTEGER NOT NULL,
ADD COLUMN     "item4" INTEGER NOT NULL,
ADD COLUMN     "item5" INTEGER NOT NULL,
ADD COLUMN     "item6" INTEGER NOT NULL,
ADD COLUMN     "mitigated" INTEGER NOT NULL,
ADD COLUMN     "pentaKills" INTEGER NOT NULL,
ADD COLUMN     "puuid" TEXT NOT NULL,
ADD COLUMN     "quadraKills" INTEGER NOT NULL,
ADD COLUMN     "tanked" INTEGER NOT NULL,
ADD COLUMN     "timeCCingOthers" INTEGER NOT NULL,
ADD COLUMN     "totalMinionsKilled" INTEGER NOT NULL,
ADD COLUMN     "totalTimeCCDealt" INTEGER NOT NULL,
ADD COLUMN     "totalTimeSpentDead" INTEGER NOT NULL,
ADD COLUMN     "tripleKills" INTEGER NOT NULL,
ADD COLUMN     "win" BOOLEAN NOT NULL,
ALTER COLUMN "damage" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "SumSpells" ADD COLUMN     "sumId" INTEGER NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_itemId_key" ON "Item"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "SumSpells_sumId_key" ON "SumSpells"("sumId");
