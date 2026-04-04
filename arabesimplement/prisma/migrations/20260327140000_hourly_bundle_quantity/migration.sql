-- AlterTable
ALTER TABLE "order_items" ADD COLUMN "hourly_quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "course_weekly_subscriptions" ADD COLUMN "bundle_quantity" INTEGER NOT NULL DEFAULT 1;
