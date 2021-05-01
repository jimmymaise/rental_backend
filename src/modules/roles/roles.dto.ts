import { StoragePublicDTO } from '../storages/storage-public.dto';
import { sanitize } from './helpers';

import { Transform } from 'class-transformer';

export class CreateRoleDto {
  name: string;
  @Transform(sanitize)
  description: string;
  orgId!: string;
  permissions: string[];
  users: string[];
}

export class UpdateRoleDto {
  id: string;
  @Transform(sanitize)
  name: string;
  description: string;
  permissionsAdded: string[];
  permissionsRemoved: string[];
  addUsersToRole: string[];
  removeUsersFromRole: string[];
}
