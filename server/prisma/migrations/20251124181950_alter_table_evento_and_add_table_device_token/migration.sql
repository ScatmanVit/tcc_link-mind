/*
  Warnings:

  - The values [scheduled,send,failed] on the enum `StatusNotificationEvent` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."StatusNotificationEvent_new" AS ENUM ('PENDING', 'SCHEDULED', 'SENT', 'FAILED');
ALTER TABLE "public"."Evento" ALTER COLUMN "statusNotification" TYPE "public"."StatusNotificationEvent_new" USING ("statusNotification"::text::"public"."StatusNotificationEvent_new");
ALTER TYPE "public"."StatusNotificationEvent" RENAME TO "StatusNotificationEvent_old";
ALTER TYPE "public"."StatusNotificationEvent_new" RENAME TO "StatusNotificationEvent";
DROP TYPE "public"."StatusNotificationEvent_old";
COMMIT;

-- CreateTable
CREATE TABLE "public"."DeviceToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DeviceToken" ADD CONSTRAINT "DeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
