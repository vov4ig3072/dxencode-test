/*
  Warnings:

  - You are about to drop the column `image` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `textFile` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "image",
DROP COLUMN "textFile",
ADD COLUMN     "path" TEXT,
ADD COLUMN     "type" TEXT;
