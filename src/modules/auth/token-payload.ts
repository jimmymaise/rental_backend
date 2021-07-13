export interface TokenPayload {
  userId: string;
  email?: string;
  facebookId?: string;
  googleId?: string;
  orgIds?: string[];
  isCurrentOrgOwner: boolean;
  isRoot?: boolean;
  currentOrgId?: string;
  currentOrgPermissionNames?: string[];
}
