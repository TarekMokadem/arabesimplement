-- CreateEnum
CREATE TYPE "FormationSchedulingMode" AS ENUM ('HOURLY_PURCHASE', 'FLEXIBLE_FORMATION', 'FIXED_SLOTS');

-- AlterTable
ALTER TABLE "formations" ADD COLUMN "scheduling_mode" "FormationSchedulingMode" NOT NULL DEFAULT 'FIXED_SLOTS';
