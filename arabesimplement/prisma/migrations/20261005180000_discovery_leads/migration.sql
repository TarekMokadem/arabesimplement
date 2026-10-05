-- CreateTable
CREATE TABLE "discovery_leads" (
    "id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "pays" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "calendly_event_uri" TEXT,
    "notes" TEXT,
    "traite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discovery_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "discovery_leads_email_idx" ON "discovery_leads"("email");

-- CreateIndex
CREATE INDEX "discovery_leads_created_at_idx" ON "discovery_leads"("created_at");

-- CreateIndex
CREATE INDEX "discovery_leads_traite_idx" ON "discovery_leads"("traite");
