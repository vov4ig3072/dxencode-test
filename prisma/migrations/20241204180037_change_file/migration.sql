/*
  Warnings:

  - Made the column `path` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "path" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL;
