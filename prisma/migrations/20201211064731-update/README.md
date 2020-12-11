# Migration `20201211064731-update`

This migration has been generated by Phat Tran at 12/11/2020, 1:47:31 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."MyUserContactItem" DROP CONSTRAINT "MyUserContactItem_userId_fkey"

CREATE TABLE "public"."MyUserContact" (
"id" text   NOT NULL ,
"ownerUserId" text   NOT NULL ,
"userId" text   NOT NULL ,
"createdDate" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

DROP TABLE "public"."MyUserContactItem"

CREATE INDEX "my_user_contact_main_index" ON "public"."MyUserContact"("ownerUserId")

ALTER TABLE "public"."MyUserContact" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201210000756-updae..20201211064731-update
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
@@ -278,9 +278,9 @@
   @@index(fields: [ownerUserId], name: "wishing_item_main_index")
 }
-model MyUserContactItem {
+model MyUserContact {
   id      String          @id @default(uuid())
   ownerUserId             String
   user           User @relation(fields: [userId], references: [id])
   userId                  String
```

