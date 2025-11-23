/*
  Warnings:

  - You are about to drop the column `estadoId` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `eventoId` on the `TagRelacionada` table. All the data in the column will be lost.
  - You are about to drop the `Resumo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `statusNotification` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."StatusNotificationEvent" AS ENUM ('scheduled', 'send');

-- DropForeignKey
ALTER TABLE "public"."Evento" DROP CONSTRAINT "Evento_estadoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Resumo" DROP CONSTRAINT "Resumo_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Resumo" DROP CONSTRAINT "Resumo_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TagRelacionada" DROP CONSTRAINT "TagRelacionada_eventoId_fkey";

-- AlterTable
ALTER TABLE "public"."Evento" DROP COLUMN "estadoId",
ADD COLUMN     "adress" TEXT,
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "expired" TIMESTAMP(3),
ADD COLUMN     "notification" BOOLEAN,
ADD COLUMN     "scheduleAt" TIMESTAMP(3),
ADD COLUMN     "statusNotification" "public"."StatusNotificationEvent" NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."TagRelacionada" DROP COLUMN "eventoId";

-- DropTable
DROP TABLE "public"."Resumo";
