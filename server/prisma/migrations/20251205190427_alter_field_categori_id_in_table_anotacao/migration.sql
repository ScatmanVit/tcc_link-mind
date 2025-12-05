-- DropForeignKey
ALTER TABLE "public"."Anotacao" DROP CONSTRAINT "Anotacao_categoriaId_fkey";

-- AlterTable
ALTER TABLE "public"."Anotacao" ALTER COLUMN "categoriaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Anotacao" ADD CONSTRAINT "Anotacao_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
