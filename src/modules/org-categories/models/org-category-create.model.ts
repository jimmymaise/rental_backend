import { OrgCategory } from '@prisma/client';
import { StoragePublicDTO } from '../../storages/storage-public.dto';

export class OrgCategoryCreateModel {
  public name: string;
  public slug: string;
  public image: StoragePublicDTO;
  public coverImage: StoragePublicDTO;
  public parentCategoryId: string;
  public seoTitle: string;
  public seoDescription: string;
  public order: number;
  public isDisabled: boolean;
  public categoryId: string;

  public static toDatabase({
    name,
    slug,
    image,
    coverImage,
    parentCategoryId,
    seoTitle,
    seoDescription,
    order,
    isDisabled,
    categoryId,
  }: OrgCategoryCreateModel): OrgCategory {
    return {
      name,
      slug,
      image,
      coverImage,
      parentCategoryId,
      seoTitle,
      seoDescription,
      order,
      isDisabled,
      category: {
        connect: {
          id: categoryId,
        },
      },
    } as any;
  }
}

export default OrgCategoryCreateModel;
