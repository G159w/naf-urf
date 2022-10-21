/*
  Warnings:

  - You are about to drop the column `gameId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `gameLoaded` on the `Game` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matchId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matchId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Game_gameId_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "gameId",
DROP COLUMN "gameLoaded",
ADD COLUMN     "matchId" TEXT NOT NULL,
ADD COLUMN     "matchLoaded" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Game_matchId_key" ON "Game"("matchId");
