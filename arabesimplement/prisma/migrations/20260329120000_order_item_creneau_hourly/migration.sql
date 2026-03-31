-- AlterTable
ALTER TABLE "order_items" ADD COLUMN "creneau_id" TEXT,
ADD COLUMN "hourly_minutes" INTEGER;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_creneau_id_fkey" FOREIGN KEY ("creneau_id") REFERENCES "creneaux"("id") ON DELETE SET NULL ON UPDATE CASCADE;
