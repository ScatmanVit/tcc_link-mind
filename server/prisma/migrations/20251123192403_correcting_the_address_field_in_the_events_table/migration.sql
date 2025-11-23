/*
  Warnings:

  - You are about to drop the column `adress` on the `Evento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Evento" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT;
