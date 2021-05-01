import { User, UserInfo } from '@prisma/client';
import { UserInfoDTO } from './user-info.dto';
import { Organization } from '@prisma/client';

const DEFAULT_AVATAR_URL =
  'https://asia-fast-storage.thuedo.vn/default-avatars/default-avatar.png';
const DEFAULT_COVER_URL =
  'https://asia-fast-storage.thuedo.vn/default-covers/nature-landscape-hot-air-balloons-festival-sky.jpg';
const DEFAULT_EMAIL = 'former_user@thuedo.vn';
const DEFAULT_DISPLAY_NAME = 'Former User';

export function toUserInfoDTO(
  user: User | any,
  userInfo: UserInfo | any,
): UserInfoDTO {
  if (!user) {
    return null;
  }
  let orgIds = user['orgsThisUserBelongTo'].map((org) => org.orgId);
  let avatarImage =
    userInfo?.avatarImage && userInfo.avatarImage.length
      ? JSON.parse(userInfo.avatarImage)
      : {};
  let coverImage =
    userInfo?.coverImage && userInfo.coverImage.length
      ? JSON.parse(userInfo.coverImage)
      : {};
  let displayName = userInfo.displayName;
  let email = user.email;
  let currentOrgId = user.currentOrgId;
  if (user.isDeleted) {
    avatarImage = {
      url: DEFAULT_AVATAR_URL,
    };
    coverImage = {
      url: DEFAULT_COVER_URL,
    };
    email = DEFAULT_EMAIL;
    displayName = DEFAULT_DISPLAY_NAME;
  }

  return {
    ...userInfo,
    id: user.id,
    lastSignedIn: user?.lastSignedIn?.getTime
      ? user?.lastSignedIn.getTime()
      : (user?.lastSignedIn as number),
    createdDate: userInfo?.createdDate?.getTime
      ? userInfo?.createdDate.getTime()
      : (userInfo?.createdDate as number),
    avatarImage,
    coverImage,
    orgIds,
    displayName,
    email,
    currentOrgId,
    isDeleted: user.isDeleted,
  };
}

export function getSummaryOrgInfo(fullOrgData: Organization) {
  return {
    name: fullOrgData.name,
    description: fullOrgData.description,
    id: fullOrgData.id,
  };
}

export function getUserCacheKey(userId: string) {
  return `USER_INFO_${userId}`;
}

export function getOrgCacheKey(userId: string) {
  return `ORG_INFO_${userId}`;
}
