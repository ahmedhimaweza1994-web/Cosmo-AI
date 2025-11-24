-- AlterTable
ALTER TABLE "Branding" ADD COLUMN     "stylePreferences" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "voiceDonts" TEXT[],
ADD COLUMN     "voiceDos" TEXT[];
