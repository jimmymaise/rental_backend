import { Category, Area } from '@prisma/client';

import { StoragePublicDTO } from '../storages/storage-public.dto';

export interface WishingItemDTO {
  id: string;
  name: string;
  slug: string;
  categories?: Category[];
  areas?: Area[];
  images?: StoragePublicDTO[];
}
