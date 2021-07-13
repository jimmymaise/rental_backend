import { Prisma } from '@prisma/client';
export interface StoragePublicDTO extends Prisma.InputJsonObject {
  isUploadField: boolean;
  id: string;
  url: string;
  imageSizes?: [string];
  signedUrl?: string;
}
