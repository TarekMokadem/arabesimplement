-- CreateEnum
CREATE TYPE "TestimonialKind" AS ENUM ('TEXT', 'AUDIO');

-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN "kind" "TestimonialKind" NOT NULL DEFAULT 'TEXT';
ALTER TABLE "testimonials" ADD COLUMN "audio_url" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "admin_enrollment_email_sent_at" TIMESTAMP(3);
