-- CreateTable
CREATE TABLE "testimonial_invites" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "testimonial_id" TEXT,

    CONSTRAINT "testimonial_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "testimonial_invites_token_hash_key" ON "testimonial_invites"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "testimonial_invites_testimonial_id_key" ON "testimonial_invites"("testimonial_id");

-- AddForeignKey
ALTER TABLE "testimonial_invites" ADD CONSTRAINT "testimonial_invites_testimonial_id_fkey" FOREIGN KEY ("testimonial_id") REFERENCES "testimonials"("id") ON DELETE SET NULL ON UPDATE CASCADE;
