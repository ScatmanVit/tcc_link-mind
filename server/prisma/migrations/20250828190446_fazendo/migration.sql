-- DropForeignKey
ALTER TABLE "public"."Link" DROP CONSTRAINT "Link_categoriaId_fkey";

-- AlterTable
ALTER TABLE "public"."Link" ALTER COLUMN "categoriaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Link" ADD CONSTRAINT "Link_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
