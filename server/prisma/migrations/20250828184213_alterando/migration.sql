/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `link` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Link" DROP CONSTRAINT "Link_estadoId_fkey";

-- AlterTable
ALTER TABLE "public"."Link" ADD COLUMN     "description" TEXT,
ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "notification" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "estadoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Link_link_key" ON "public"."Link"("link");

-- AddForeignKey
ALTER TABLE "public"."Link" ADD CONSTRAINT "Link_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "public"."Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;
