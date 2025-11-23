-- DropForeignKey
ALTER TABLE "public"."Evento" DROP CONSTRAINT "Evento_categoriaId_fkey";

-- AlterTable
ALTER TABLE "public"."Evento" ALTER COLUMN "categoriaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Evento" ADD CONSTRAINT "Evento_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
