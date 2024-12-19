-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('statement', 'shortText', 'longText', 'email', 'phone', 'number', 'url', 'singleSelect', 'multiSelect', 'dropdown', 'date', 'fileUpload');

-- CreateEnum
CREATE TYPE "SpecialBlockType" AS ENUM ('welcome', 'thankYou');

-- CreateEnum
CREATE TYPE "LogicConditionType" AS ENUM ('EQUALS', 'NOT_EQUALS', 'CONTAINS', 'NOT_CONTAINS', 'GREATER_THAN', 'LESS_THAN');

-- CreateEnum
CREATE TYPE "LogicAction" AS ENUM ('SHOW', 'HIDE', 'SKIP_TO');

-- CreateEnum
CREATE TYPE "DomainVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "SSLStatus" AS ENUM ('PENDING', 'ACTIVE', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forms" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_blocks" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "type" "BlockType" NOT NULL,
    "isSpecial" "SpecialBlockType",
    "question" TEXT NOT NULL,
    "description" TEXT,
    "buttonText" TEXT,
    "buttonUrl" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "placeholder" TEXT,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "maxLength" INTEGER,
    "minValue" INTEGER,
    "maxValue" INTEGER,
    "maxFileSize" INTEGER,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_logic" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "sourceBlockId" TEXT NOT NULL,
    "conditionType" "LogicConditionType" NOT NULL,
    "conditionValue" TEXT NOT NULL,
    "targetBlockId" TEXT NOT NULL,
    "action" "LogicAction" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_logic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_responses" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "respondentIp" TEXT,
    "userAgent" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_answers" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "response_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_domains" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "verificationStatus" "DomainVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "sslStatus" "SSLStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_domains_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "custom_domains_domain_key" ON "custom_domains"("domain");

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_blocks" ADD CONSTRAINT "form_blocks_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_logic" ADD CONSTRAINT "form_logic_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_logic" ADD CONSTRAINT "form_logic_sourceBlockId_fkey" FOREIGN KEY ("sourceBlockId") REFERENCES "form_blocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_logic" ADD CONSTRAINT "form_logic_targetBlockId_fkey" FOREIGN KEY ("targetBlockId") REFERENCES "form_blocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_answers" ADD CONSTRAINT "response_answers_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "form_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_answers" ADD CONSTRAINT "response_answers_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "form_blocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_domains" ADD CONSTRAINT "custom_domains_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
