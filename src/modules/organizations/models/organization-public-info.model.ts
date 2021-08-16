import { Organization } from '@prisma/client';

import { StoragePublicDTO } from '../../storages/storage-public.dto';

export class OrganizationPublicInfoModel {
  public id?: string;
  public name?: string;
  public avatarImage?: StoragePublicDTO;
  public description: string;
  public slug: string;
  public areas?: {
    name: string;
    slug: string;
  };
  public isOrgInMyContactBook?: boolean;

  public static fromDbOrganization(
    dbOrg: Organization,
  ): OrganizationPublicInfoModel {
    return {
      id: dbOrg.id,
      name: dbOrg.name,
      slug: dbOrg.slug,
      description: dbOrg.description,
      avatarImage: dbOrg.avatarImage as any,
      areas: (dbOrg as any).areas?.map((area) => area) || [],
      isOrgInMyContactBook: false,
    };
  }
}
