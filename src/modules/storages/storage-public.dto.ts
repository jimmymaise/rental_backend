import { Prisma } from '@prisma/client';

export interface StoragePublicDTO extends Prisma.InputJsonObject {
  isUploadField: boolean
  id: string
  url: string
  signedUrl?: {
    url: string
    smallUrl: string
    mediumUrl: string
  }
}




export interface StoragePublicDTO extends Prisma.InputJsonObject {
  id: string
  url: string
  image_sizes?: [string]
  signedUrl?: {
    url: string
    smallUrl: string
    mediumUrl: string
  }
}
