/*
  Warnings:

  - Added the required column `userId` to the `Categoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Categoria" ADD COLUMN     "userId" UUID NOT NULL;
