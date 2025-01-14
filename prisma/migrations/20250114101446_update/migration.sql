/*
  Warnings:

  - Added the required column `author` to the `Presentation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Presentation" ADD COLUMN     "author" TEXT NOT NULL;
