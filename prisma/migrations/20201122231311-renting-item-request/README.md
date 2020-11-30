# Migration `20201122231311-renting-item-request`

This migration has been generated by Phat Tran at 11/23/2020, 6:13:11 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."RentingItemRequest" DROP COLUMN "actualAmount",
ADD COLUMN "actualTotalAmount" Decimal(65,30)   DEFAULT 0,
ALTER COLUMN "totalAmount" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "rentTotalQuantity" DROP NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201121235222-unique-refresh-token..20201122231311-renting-item-request
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -138,14 +138,14 @@
 model RentingItemRequest {
   id                      String          @id @default(uuid())
   rentingItem           Item @relation(fields: [itemId], references: [id])
   itemId                String
-  totalAmount             Float           @default(0)
-  actualAmount            Float           @default(0)
-  rentTotalQuantity       Int             @default(1)
+  totalAmount             Float?           @default(0)
+  actualTotalAmount            Float?           @default(0)
+  rentTotalQuantity       Int?             @default(1)
   fromDate                DateTime
   toDate                  DateTime
-  status                  RentingItemRequestStatus
+  status                  RentingItemRequestStatus?
   ownerUserId             String
   lenderUserId            String
   isDeleted               Boolean?        @default(false)
   createdDate             DateTime        @default(now())
```

