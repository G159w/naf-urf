/*
  Warnings:

  - You are about to drop the column `allyTeam` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `firstBloodKill` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `item0` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `item1` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `item2` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `item3` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `item4` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `item5` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `item6` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `win` on the `PlayerStat` table. All the data in the column will be lost.
  - Added the required column `isAllyTeam` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isFirstBloodKill` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isWin` to the `PlayerStat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerStat" DROP COLUMN "allyTeam",
DROP COLUMN "firstBloodKill",
DROP COLUMN "item0",
DROP COLUMN "item1",
DROP COLUMN "item2",
DROP COLUMN "item3",
DROP COLUMN "item4",
DROP COLUMN "item5",
DROP COLUMN "item6",
DROP COLUMN "win",
ADD COLUMN     "isAllyTeam" BOOLEAN NOT NULL,
ADD COLUMN     "isFirstBloodKill" BOOLEAN NOT NULL,
ADD COLUMN     "isWin" BOOLEAN NOT NULL;
