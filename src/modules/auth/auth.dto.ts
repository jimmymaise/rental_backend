export interface AuthDTO {
  accessToken?: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    currentOrgId?: string;
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
  currentOrgPermissionNames?: string[];
}
