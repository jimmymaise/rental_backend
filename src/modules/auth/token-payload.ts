import { SystemPermission } from '@app/system-permission';

export interface TokenPayload {
  userId: string;
  email?: string;
  facebookId?: string;
  googleId?: string;
  permissions?: SystemPermission[];
}
