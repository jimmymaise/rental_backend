import { SystemPermission } from '@app/system-permission';

export interface TokenPayload {
  userId: string;
  email?: string;
  facebookId?: string;
  googleId?: string;
  orgIds?: string[];
  isCurrentOrgOwner: boolean;
  currentOrgId?: string;
  currentOrgPermissionNames?: string[];
}
