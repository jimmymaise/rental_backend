import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import sample from 'lodash/sample';
import isEmpty from 'lodash/isEmpty';
import sanitizeHtml from 'sanitize-html';

import { PrismaService } from '../prisma/prisma.service';
import { User, UserInfo } from '@prisma/client';
import { StoragesService } from '../storages/storages.service';
import { UserInfoInputDTO, UserInfoDTO } from './user-info.dto';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { EncryptByAesCBCPassword } from '@helpers/encrypt';

const DEFAULT_AVATARS = [
  'https://asia-fast-storage.thuedo.vn/default-avatars/default_0008_avatar-1.jpg',
  'https://asia-fast-storage.thuedo.vn/default-avatars/default_0007_avatar-2.jpg',
  'https://asia-fast-storage.thuedo.vn/default-avatars/default_0006_avatar-3.jpg',
  'https://asia-fast-storage.thuedo.vn/default-avatars/default_0005_avatar-4.jpg',
  'https://asia-fast-storage.thuedo.vn/default-avatars/default_0004_avatar-5.jpg',
  'https://asia-fast-storage.thuedo.vn/default-avatars/default_0003_avatar-6.jpg',
  'https://asia-fast-storage.thuedo.vn/default-avatars/default_0002_avatar-7.jpg',
  'https://asia-fast-storage.thuedo.vn/default-avatars/default_0001_avatar-8.jpg',
  'https://asia-fast-storage.thuedo.vn/default-avatars/default_0000_avatar-9.jpg',
];

const DEFAULT_COVERS = [
  'https://asia-fast-storage.thuedo.vn/default-covers/Wavy_Tsp-02_Single-09.jpg',
  'https://asia-fast-storage.thuedo.vn/default-covers/mount-fuji-lake-kawaguchiko-sunrise-vintage.jpg',
  'https://asia-fast-storage.thuedo.vn/default-covers/nature-landscape-hot-air-balloons-festival-sky.jpg',
  'https://asia-fast-storage.thuedo.vn/default-covers/panorama-rice-fields-terraced-sunset-mu-cang-chai.jpg',
  'https://asia-fast-storage.thuedo.vn/default-covers/scenery-sunburst-lake-mount-assiniboine-reflections-pine-tree-sunrise.jpg',
];

function toUserInfoDTO(user: User, userInfo: UserInfo): UserInfoDTO {
  if (!user) {
    return null;
  }

  return {
    ...userInfo,
    id: user.id,
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

function getUserCacheKey(userId: string) {
  return `USER_INFO_${userId}`;
}

function encryptPhoneNumber(userInfo: UserInfoDTO): UserInfoDTO {
  return {
    ...userInfo,
    phoneNumber: !isEmpty(userInfo.phoneNumber)
      ? EncryptByAesCBCPassword(
          userInfo.phoneNumber,
          process.env.ENCRYPT_PHONE_NUMBER_PASSWORD,
        )
      : userInfo.phoneNumber,
  };
}

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StoragesService,
    private redisCacheService: RedisCacheService,
  ) {}

  async isUserInMyContactList(
    userId: string,
    otherUserId: string,
  ): Promise<boolean> {
    return (
      (await this.prismaService.myUserContact.findUnique({
        where: {
          ownerUserId_userId: {
            userId: otherUserId,
            ownerUserId: userId,
          },
        },
      })) !== null
    );
  }

  async getUserDetailData(
    userId: string,
    isDisableEncryptPhoneNumber = false,
  ): Promise<UserInfoDTO> {
    if (!userId) {
      return null;
    }

    const cacheKey = getUserCacheKey(userId);
    let userDetail = await this.redisCacheService.get(cacheKey);

    if (userDetail) {
      return !isDisableEncryptPhoneNumber
        ? encryptPhoneNumber(userDetail as UserInfoDTO)
        : (userDetail as UserInfoDTO);
    }

    const userData = await this.getUserById(userId);
    const userInfoData = await this.getUserInfoById(userId);

    userDetail = toUserInfoDTO(userData, userInfoData);

    this.redisCacheService.set(cacheKey, userDetail || {}, 3600);

    return !isDisableEncryptPhoneNumber
      ? encryptPhoneNumber(userDetail as UserInfoDTO)
      : (userDetail as UserInfoDTO);
  }

  async getUserById(userId: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id: userId } });
    // throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getUserInfoById(userId: string): Promise<UserInfo> {
    return this.prismaService.userInfo.findUnique({ where: { userId } });
  }

  async createUserByEmailPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.prismaService.user.create({
      data: { email: sanitizeHtml(email), passwordHash },
    });
  }

  async setUserPassword(
    userId: string,
    password: string,
    isClearResetPasswordToken?: boolean,
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const data: any = { passwordHash };

    if (isClearResetPasswordToken) {
      data['resetPasswordToken'] = null;
    }

    return this.prismaService.user.update({
      where: { id: userId },
      include: {
        permissions: true,
      },
      data,
    });
  }

  async createUserByFacebookAccount(
    facebookId: string,
    facebookAccessToken: string,
    email: string = null,
  ): Promise<User> {
    return this.prismaService.user.create({
      data: { facebookId, facebookAccessToken, email },
    });
  }

  async createUserByGoogleAccount(
    googleId: string,
    googleAccessToken: string,
    email: string = null,
  ): Promise<User> {
    return this.prismaService.user.create({
      data: { googleId, googleAccessToken, email },
    });
  }

  async getUserByFacebookId(facebookId: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { facebookId },
      include: {
        permissions: true,
      },
    });

    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { googleId },
      include: {
        permissions: true,
      },
    });

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: {
        permissions: true,
      },
    });

    return user;
  }

  async updateLastSignedIn(userId: string): Promise<User> {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        lastSignedIn: new Date(),
      },
    });
  }

  async connectWithFacebookAccount(
    userId: string,
    facebookId: string,
    facebookAccessToken: string,
  ): Promise<User> {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { facebookId, facebookAccessToken },
    });

    return user;
  }

  async connectWithGoogleAccount(
    userId: string,
    googleId: string,
    googleAccessToken: string,
  ): Promise<User> {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { googleId, googleAccessToken },
    });

    return user;
  }

  async getUserByEmailPassword(email: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { permissions: true },
    });
    if (!user) {
      throw new Error('No such user found');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid password');
    }

    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('No such user found');
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid current password');
    }

    await this.setUserPassword(userId, newPassword);

    return user;
  }

  async removeCurrentRefreshToken(userId: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        currentHashedRefreshToken: null,
      },
    });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        currentHashedRefreshToken,
      },
    });
  }

  async setResetPasswordToken(token: string, userId: string) {
    const resetPasswordToken = await bcrypt.hash(token, 10);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        resetPasswordToken,
      },
    });
  }

  async verifyResetPasswordToken(token: string, userId: string) {
    const user = await this.getUserById(userId);

    if (!user.resetPasswordToken) {
      throw new Error('Token not valid');
    }

    const tokenMatch = await bcrypt.compare(token, user.resetPasswordToken);

    if (tokenMatch) {
      return user;
    }
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async createTheProfileForUser(
    userId: string,
    info: UserInfo,
  ): Promise<UserInfo> {
    return await this.prismaService.userInfo.create({
      data: {
        displayName: sanitizeHtml(info.displayName || ''),
        bio: sanitizeHtml(info.bio || ''),
        avatarImage: JSON.stringify({
          url: sample(DEFAULT_AVATARS),
        }),
        coverImage: JSON.stringify({
          url: sample(DEFAULT_COVERS),
        }),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async updateUserProfile(
    userId: string,
    data: UserInfoInputDTO,
  ): Promise<UserInfoDTO> {
    const ALLOW_UPDATE_FIELDS = [
      'displayName',
      'bio',
      'avatarImage',
      'coverImage',
      'phoneNumber',
    ];
    const updateData: any = {};

    for (let i = 0; i < ALLOW_UPDATE_FIELDS.length; i++) {
      let field = ALLOW_UPDATE_FIELDS[i];

      switch (field) {
        case 'displayName':
        case 'bio':
          if (data[field]) {
            updateData[field] = sanitizeHtml(data[field]);
          }
          break;
        case 'avatarImage':
          if (data[field]) {
            this.storageService.handleUploadImageBySignedUrlComplete(
              data[field].id,
              ['small', 'medium'],
            );
            updateData[field] = JSON.stringify(data[field]);
          }
          break;
        case 'coverImage':
          if (data[field]) {
            this.storageService.handleUploadImageBySignedUrlComplete(
              data[field].id,
            );
            updateData[field] = JSON.stringify(data[field]);
          }
          break;
        default:
          if (data[field]) {
            updateData[field] = data[field];
          }
          break;
      }
    }

    const cacheKey = getUserCacheKey(userId);
    const userDetailCache = await this.redisCacheService.get(cacheKey);

    const updatedUserInfo = await this.prismaService.userInfo.upsert({
      where: {
        userId,
      },
      update: updateData,
      create: {
        ...updateData,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const userInfoData = toUserInfoDTO(userDetailCache as any, updatedUserInfo);
    this.redisCacheService.set(cacheKey, userInfoData, 3600);

    return userInfoData;
  }
}
