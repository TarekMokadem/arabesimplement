-- CreateTable
CREATE TABLE "promo_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "amount_off_euros" DECIMAL(10,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "max_redemptions" INTEGER,
    "redemption_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promo_codes_code_key" ON "promo_codes"("code");

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "promo_code_id" TEXT;
ALTER TABLE "orders" ADD COLUMN "promo_code_snapshot" VARCHAR(32);
ALTER TABLE "orders" ADD COLUMN "subtotal_euros" DECIMAL(10,2);
ALTER TABLE "orders" ADD COLUMN "discount_euros" DECIMAL(10,2);
ALTER TABLE "orders" ADD COLUMN "promo_redeemed_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "promo_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
