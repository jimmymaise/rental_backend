import { SystemPermission } from '@app/system-permission';

export interface AuthDTO {
  accessToken?: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
  };
}

export interface GuardUserPayload {
  id: string;
  userId?: string;
  email: string;
  facebookId?: string;
  googleId?: string;
  orgIds?: string[];
  currentOrgId?: string;
  isCurrentOrgOwner: boolean;
  permissions?: SystemPermission[];
  currentOrgPermissionNames?: string[];
}
