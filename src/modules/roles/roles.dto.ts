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
}

export class UpdateRoleDto {
  id: string;
  @Transform(sanitizeHtml)
  name: string;
  description: string;
  addPermissionsToRole: string[];
  removePermissionsFromRole: string[];
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
