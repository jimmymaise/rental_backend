# Migration `20201118214245-add-index`

This migration has been generated by Phat Tran at 11/19/2020, 4:42:45 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
DROP INDEX "public"."item_main_index"

CREATE INDEX "item_main_index" ON "public"."Item"("name", "slug", "keyword", "status", "ownerUserId", "isDeleted")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201118113657-sss..20201118214245-add-index
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
@@ -113,9 +113,9 @@
   updatedBy               String
   itemRentingDates        ItemRentingDate[]
   keyword                 String?
-  @@index(fields: [name, slug, status, ownerUserId, isDeleted], name: "item_main_index")
+  @@index(fields: [name, slug, keyword, status, ownerUserId, isDeleted], name: "item_main_index")
 }
 enum RentingMandatoryVerifyDocumentDataType {
   Label
```

