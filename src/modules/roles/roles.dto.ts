import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';

import { StoragePublicDTO } from '../storages/storage-public.dto';
import { UserInfoDTO } from '../users/user-info.dto';
import { sanitize } from './helpers';

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

export class RoleDTO {
  id: string;
  @Transform(sanitize)
  name: string;
  @Transform(sanitize)
  description: string;
  permissions: Permission[];
  users: UserInfoDTO[];
}
