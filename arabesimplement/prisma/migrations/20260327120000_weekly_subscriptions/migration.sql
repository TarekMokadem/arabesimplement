-- CreateEnum
CREATE TYPE "WeeklySubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELED', 'PAST_DUE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "stripe_customer_id" TEXT;
ALTER TABLE "orders" ADD COLUMN "stripe_subscription_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_subscription_id_key" ON "orders"("stripe_subscription_id");

-- CreateTable
CREATE TABLE "course_weekly_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "order_id" TEXT,
    "formation_id" TEXT NOT NULL,
    "creneau_id" TEXT,
    "hourly_minutes" INTEGER NOT NULL,
    "stripe_subscription_id" TEXT NOT NULL,
    "stripe_subscription_item_id" TEXT,
    "status" "WeeklySubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "current_period_end" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_weekly_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_weekly_subscriptions_stripe_subscription_item_id_key" ON "course_weekly_subscriptions"("stripe_subscription_item_id");

-- AddForeignKey
ALTER TABLE "course_weekly_subscriptions" ADD CONSTRAINT "course_weekly_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_weekly_subscriptions" ADD CONSTRAINT "course_weekly_subscriptions_formation_id_fkey" FOREIGN KEY ("formation_id") REFERENCES "formations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_weekly_subscriptions" ADD CONSTRAINT "course_weekly_subscriptions_creneau_id_fkey" FOREIGN KEY ("creneau_id") REFERENCES "creneaux"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_weekly_subscriptions" ADD CONSTRAINT "course_weekly_subscriptions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN "cart_line_id" TEXT;
