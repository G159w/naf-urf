/*
  Warnings:

  - You are about to drop the column `matchLoaded` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "matchLoaded",
ADD COLUMN     "isMatchLoaded" BOOLEAN NOT NULL DEFAULT false;
