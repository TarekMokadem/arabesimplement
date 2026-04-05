-- CreateEnum
CREATE TYPE "FormationTheme" AS ENUM ('ARABE', 'RELIGION', 'MIX');

-- AlterTable
ALTER TABLE "formations" ADD COLUMN "theme" "FormationTheme";

UPDATE "formations" SET "theme" = CASE
  WHEN lower(trim("categorie")) IN (
    'lecture', 'arabe', 'langue', 'grammaire', 'alphabet'
  ) THEN 'ARABE'::"FormationTheme"
  WHEN lower(trim("categorie")) IN (
    'tajwid', 'invocations', 'coran', 'religion', 'sciences',
    'fiqh', 'aqida', 'hadith', 'sciences islamiques'
  ) THEN 'RELIGION'::"FormationTheme"
  ELSE 'ARABE'::"FormationTheme"
END;

ALTER TABLE "formations" ALTER COLUMN "theme" SET NOT NULL;
ALTER TABLE "formations" ALTER COLUMN "theme" SET DEFAULT 'ARABE'::"FormationTheme";

ALTER TABLE "formations" DROP COLUMN "categorie";
