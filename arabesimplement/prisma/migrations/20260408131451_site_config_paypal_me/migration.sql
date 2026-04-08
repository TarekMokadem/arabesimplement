-- CreateEnum
CREATE TYPE "PaypalMeRecipient" AS ENUM ('YACINE_BOU18', 'JANA_OKF');

-- CreateTable
CREATE TABLE "site_config" (
    "id" TEXT NOT NULL,
    "paypal_me_recipient" "PaypalMeRecipient" NOT NULL DEFAULT 'YACINE_BOU18',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_config_pkey" PRIMARY KEY ("id")
);
