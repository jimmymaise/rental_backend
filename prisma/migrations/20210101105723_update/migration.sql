/*
  Warnings:

  - Added the required column `createdBy` to the `ChatConversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatConversation" ADD COLUMN     "createdBy" TEXT NOT NULL;
