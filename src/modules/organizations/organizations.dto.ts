import { StoragePublicDTO } from '../storages/storage-public.dto';
import { sanitize } from './helpers';

import { Transform } from 'class-transformer';


export class CreateOrganizationDto {
  name?: string;
  avatarImage?: StoragePublicDTO;
  @Transform(sanitize)
  description: string;
  slug: string;
}

export class UpdateMyOrganizationDto {
  id?:string
  name?: string;
  avatarImage?: StoragePublicDTO;
  @Transform(sanitize)
  description: string;
  slug: string;
  addUsersToOrg: string[];
  removeUsersFromOrg: string[];
  setOwner: setOwner

}

class setOwner {
  userId:string;
  isOwner:boolean
}


export class AddUserToMyOrganizationDto {
  userId: string;
}

