import { User, UserInfo } from '@prisma/client';
import { UserInfoDTO } from './user-info.dto';

export function toUserInfoDTO(
  user: User | any,
  userInfo: UserInfo | any,
): UserInfoDTO {
  if (!user) {
    return null;
  }

  console.log(user);

  return {
    ...userInfo,
    id: user.id,
    lastSignedIn: user?.lastSignedIn?.getTime
      ? user?.lastSignedIn.getTime()
      : (user?.lastSignedIn as number),
    createdDate: userInfo?.createdDate?.getTime
      ? userInfo?.createdDate.getTime()
      : (userInfo?.createdDate as number),
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
