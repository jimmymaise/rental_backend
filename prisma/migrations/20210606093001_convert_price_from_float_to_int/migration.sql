/*
  Warnings:

  - You are about to alter the column `currentOriginalPrice` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `sellPrice` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `rentPricePerDay` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `rentPricePerWeek` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `rentPricePerMonth` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `valueAmount` on the `RentingDepositItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `totalAmount` on the `RentingItemRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `actualTotalAmount` on the `RentingItemRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `rentPricePerDay` on the `RentingItemRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `rentPricePerWeek` on the `RentingItemRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `rentPricePerMonth` on the `RentingItemRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `amount` on the `RentingOrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `unitPrice` on the `RentingOrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `unitPricePerDay` on the `RentingOrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `unitPricePerWeek` on the `RentingOrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `unitPricePerMonth` on the `RentingOrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `totalAmount` on the `SellingOrder` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "currentOriginalPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "sellPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "rentPricePerDay" SET DATA TYPE INTEGER,
ALTER COLUMN "rentPricePerWeek" SET DATA TYPE INTEGER,
ALTER COLUMN "rentPricePerMonth" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "RentingDepositItem" ALTER COLUMN "valueAmount" SET DEFAULT 0,
ALTER COLUMN "valueAmount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "RentingItemRequest" ALTER COLUMN "totalAmount" SET DEFAULT 0,
ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "actualTotalAmount" SET DEFAULT 0,
ALTER COLUMN "actualTotalAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "rentPricePerDay" SET DATA TYPE INTEGER,
ALTER COLUMN "rentPricePerWeek" SET DATA TYPE INTEGER,
ALTER COLUMN "rentPricePerMonth" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "RentingOrderItem" ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "unitPrice" SET DEFAULT 0,
ALTER COLUMN "unitPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "unitPricePerDay" SET DEFAULT 0,
ALTER COLUMN "unitPricePerDay" SET DATA TYPE INTEGER,
ALTER COLUMN "unitPricePerWeek" SET DEFAULT 0,
ALTER COLUMN "unitPricePerWeek" SET DATA TYPE INTEGER,
ALTER COLUMN "unitPricePerMonth" SET DEFAULT 0,
ALTER COLUMN "unitPricePerMonth" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "SellingOrder" ALTER COLUMN "totalAmount" SET DEFAULT 0,
ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER;
