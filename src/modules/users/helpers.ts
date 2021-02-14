import { User, UserInfo } from '@prisma/client';
import { UserInfoDTO } from './user-info.dto';

export function toUserInfoDTO(user: User, userInfo: UserInfo): UserInfoDTO {
  if (!user) {
    return null;
  }

  return {
    ...userInfo,
    id: user.id,
    lastSignedIn: user?.lastSignedIn.getTime(),
    createdDate: userInfo?.createdDate.getTime(),
    avatarImage:
      userInfo?.avatarImage && userInfo.avatarImage.length
        ? JSON.parse(userInfo.avatarImage)
        : [],
    coverImage:
      userInfo?.coverImage && userInfo.coverImage.length
        ? JSON.parse(userInfo.coverImage)
        : [],
    email: user?.email,
  };
}

export function getUserCacheKey(userId: string) {
  return `USER_INFO_${userId}`;
}
