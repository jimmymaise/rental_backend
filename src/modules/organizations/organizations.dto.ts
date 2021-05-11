import { StoragePublicDTO } from '../storages/storage-public.dto';
import { sanitize } from './helpers';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';

export class OrganizationSummaryCacheDto {
  id?: string;
  name?: string;
  avatarImage?: StoragePublicDTO;
  description: string;
  slug: string;
}

export class CreateOrganizationDto {
  name?: string;
  avatarImage?: StoragePublicDTO;
  @Transform(sanitize)
  description: string;
  slug: string;
}

export class UpdateMyOrganizationDto {
  id?: string;
  name?: string;
  avatarImage?: StoragePublicDTO;
  @Transform(sanitize)
  description: string;
  slug: string;
  addEmployeesToOrgByUserId: string[];
  removeEmployeesFromOrgByUserId: string[];
  setOwner: SetOwner;
}

class SetOwner {
  userId: string;
  isOwner: boolean;
}

