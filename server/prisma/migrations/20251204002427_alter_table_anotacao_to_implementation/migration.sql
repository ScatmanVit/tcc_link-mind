/*
  Warnings:

  - You are about to drop the column `estadoId` on the `Anotacao` table. All the data in the column will be lost.
  - You are about to drop the column `anotacaoId` on the `TagRelacionada` table. All the data in the column will be lost.
  - You are about to drop the column `compraId` on the `TagRelacionada` table. All the data in the column will be lost.
  - You are about to drop the `Compra` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `annotation` to the `Anotacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Anotacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Anotacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Anotacao" DROP CONSTRAINT "Anotacao_estadoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Compra" DROP CONSTRAINT "Compra_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Compra" DROP CONSTRAINT "Compra_estadoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Compra" DROP CONSTRAINT "Compra_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TagRelacionada" DROP CONSTRAINT "TagRelacionada_anotacaoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TagRelacionada" DROP CONSTRAINT "TagRelacionada_compraId_fkey";

-- AlterTable
ALTER TABLE "public"."Anotacao" DROP COLUMN "estadoId",
ADD COLUMN     "annotation" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL;

-- AlterTable
ALTER TABLE "public"."TagRelacionada" DROP COLUMN "anotacaoId",
DROP COLUMN "compraId";

-- DropTable
DROP TABLE "public"."Compra";
