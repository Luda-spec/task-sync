/*
  Warnings:

  - The values [DAILY,WEEKLY] on the enum `RepeatType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RepeatType_new" AS ENUM ('NEVER', 'DAILY_WEEK', 'EVERY_2DAYS', 'EVERY_2DAYS_MONTH', 'WEEKLY_MONTH');
ALTER TABLE "task" ALTER COLUMN "repeat" DROP DEFAULT;
ALTER TABLE "task" ALTER COLUMN "repeat" TYPE "RepeatType_new" USING ("repeat"::text::"RepeatType_new");
ALTER TYPE "RepeatType" RENAME TO "RepeatType_old";
ALTER TYPE "RepeatType_new" RENAME TO "RepeatType";
DROP TYPE "RepeatType_old";
ALTER TABLE "task" ALTER COLUMN "repeat" SET DEFAULT 'NEVER';
COMMIT;
