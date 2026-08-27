/*
  Warnings:

  - You are about to drop the column `couponCode` on the `FreeCourse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[question]` on the table `Faq` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Feature` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `JourneyStep` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."FreeCourse" DROP COLUMN "couponCode";

-- CreateIndex
CREATE UNIQUE INDEX "Faq_question_key" ON "public"."Faq"("question");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_title_key" ON "public"."Feature"("title");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyStep_title_key" ON "public"."JourneyStep"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_name_key" ON "public"."Partner"("name");
