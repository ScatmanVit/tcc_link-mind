/*
  Warnings:

  - The `expired` column on the `Evento` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Evento" DROP COLUMN "expired",
ADD COLUMN     "expired" BOOLEAN,
ALTER COLUMN "scheduleAt" SET DATA TYPE TEXT;
