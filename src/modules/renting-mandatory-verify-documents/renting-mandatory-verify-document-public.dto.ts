import { Prisma } from '@prisma/client';

export interface RentingMandatoryVerifyDocumentPublicDTO
  extends Prisma.JsonObject {
  id: string;
  name: string;
  dataType?: string;
  value?: string;
}
