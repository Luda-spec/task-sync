/*
  Warnings:

  - You are about to drop the column `is_completed` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM ('NEVER', 'DAILY', 'WEEKLY');

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "description" TEXT,
ADD COLUMN     "repeat" "RepeatType" DEFAULT 'NEVER',
ADD COLUMN     "scheduled_at" TIMESTAMP(3),
ADD COLUMN     "time_from" TEXT,
ADD COLUMN     "time_to" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "is_completed",
ADD COLUMN     "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "work_interval" INTEGER DEFAULT 50;
