-- AlterEnum
ALTER TYPE "public"."StatusNotificationEvent" ADD VALUE 'failed';

-- AlterTable
ALTER TABLE "public"."Evento" ALTER COLUMN "statusNotification" DROP NOT NULL;
