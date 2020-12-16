# Migration `20201211134821-update`

This migration has been generated by Phat Tran at 12/11/2020, 8:48:21 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."RentingItemRequestActivity" DROP COLUMN "isLocked",
DROP COLUMN "lockedBy"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201211134733-update..20201211134821-update
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
@@ -229,10 +229,8 @@
   itemId                String
   comment             String?
   type              RentingItemRequestActivityType
   files                 String? // JSON
-  isLocked              Boolean?        @default(false)
-  lockedBy               String
   isDisabled              Boolean?        @default(false)
   isDeleted               Boolean?        @default(false)
   createdDate             DateTime        @default(now())
   updatedDate             DateTime        @default(now())
```

