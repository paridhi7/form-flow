-- AlterTable
ALTER TABLE "forms" ADD COLUMN     "themeId" TEXT;

-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "questionColor" TEXT NOT NULL DEFAULT '#000000',
    "answerColor" TEXT NOT NULL DEFAULT '#000000',
    "buttonColor" TEXT NOT NULL DEFAULT '#292929',
    "buttonTextColor" TEXT NOT NULL DEFAULT '#ffffff',
    "font" TEXT NOT NULL DEFAULT 'Inter',
    "logo" TEXT,
    "backgroundImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
