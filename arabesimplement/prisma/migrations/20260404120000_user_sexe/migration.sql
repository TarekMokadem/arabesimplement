-- CreateEnum
CREATE TYPE "StudentSex" AS ENUM ('FEMME', 'HOMME');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "sexe" "StudentSex";
