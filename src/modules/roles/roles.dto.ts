import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';

import { UserInfoDTO } from '../users/user-info.dto';
import { sanitizeHtml } from '@helpers/transforms/sanitize-html';

export class CreateRoleDto {
  name: string;
  @Transform(sanitizeHtml)
  description: string;
  orgId!: string;
  permissions: string[];
  users: string[];
}

export class UpdateRoleDto {
  id: string;
  @Transform(sanitizeHtml)
  name: string;
  description: string;
  addPermissionsToRole: string[];
  removePermissionsFromRole: string[];
  addUsersToRole: string[];
  removeUsersFromRole: string[];
}

export class RoleDTO {
  id: string;
  @Transform(sanitizeHtml)
  name: string;
  @Transform(sanitizeHtml)
  description: string;
  permissions: Permission[];
  users: UserInfoDTO[];
}
