-- CreateTable
CREATE TABLE "public"."Resumo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "categoriaId" UUID,
    "title" TEXT NOT NULL,
    "originalLinkUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resumo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resumo_userId_idx" ON "public"."Resumo"("userId");

-- CreateIndex
CREATE INDEX "Resumo_originalLinkUrl_idx" ON "public"."Resumo"("originalLinkUrl");

-- AddForeignKey
ALTER TABLE "public"."Resumo" ADD CONSTRAINT "Resumo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resumo" ADD CONSTRAINT "Resumo_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
