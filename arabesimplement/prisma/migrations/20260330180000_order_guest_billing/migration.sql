-- AlterTable
ALTER TABLE "orders" ADD COLUMN "billing_snapshot" JSONB;

-- Nullable user_id for invité avant paiement
ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL;
