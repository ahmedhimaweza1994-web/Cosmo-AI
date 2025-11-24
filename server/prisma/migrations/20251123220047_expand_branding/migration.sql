-- AlterTable
ALTER TABLE "Branding" ADD COLUMN     "accentColor" TEXT,
ADD COLUMN     "backgroundColor" TEXT,
ADD COLUMN     "brandValues" TEXT[],
ADD COLUMN     "businessCardBackUrl" TEXT,
ADD COLUMN     "businessCardFrontUrl" TEXT,
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "faviconUrl" TEXT,
ADD COLUMN     "fontBody" TEXT,
ADD COLUMN     "fontHeading" TEXT,
ADD COLUMN     "logoDarkUrl" TEXT,
ADD COLUMN     "logoLightUrl" TEXT,
ADD COLUMN     "socialBannerUrl" TEXT,
ADD COLUMN     "voiceTone" TEXT;
