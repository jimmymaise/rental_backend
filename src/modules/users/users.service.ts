import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import sample from 'lodash/sample';
import isEmpty from 'lodash/isEmpty';
import sanitizeHtml from 'sanitize-html';

import { PrismaService } from '../prisma/prisma.service';
import { User, UserInfo } from '@prisma/client';
import { StoragesService } from '../storages/storages.service';
import {
  UserInfoInputDTO,
  UserInfoDTO,
  UserInfoForMakingToken,
  UserSummary,
} from './user-info.dto';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { EncryptByAesCBCPassword } from '@helpers/encrypt';
import { getUserCacheKey, toUserInfoDTO } from './helpers';
import { AuthService } from '@modules/auth/auth.service';
import { OrganizationsService } from '@modules/organizations/organizations.service';

import { AuthDTO } from '@modules/auth/auth.dto';
import { CursorPagingHandler } from '@helpers/handlers/cursor-paging-handler';
import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';

import { OffsetPaginationDTO } from '@app/models';

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

interface SignInUserSSOInfo {
  email?: string;
  displayName?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StoragesService,
    private redisCacheService: RedisCacheService,
    private authService: AuthService,
    private organizationsService: OrganizationsService,
  ) {
  }

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


  async getAllUsersWithOffsetPaging(
    whereQuery: object,
    pageSize: number,
    offset?: any,
    orderBy: object = { id: 'desc' },
    include?: object,
  ): Promise<OffsetPaginationDTO<UserSummary>> {
    let pagingHandler = new OffsetPagingHandler(
      whereQuery,
      pageSize,
      orderBy,
      this.prismaService,
      'user',
      include,
    );
    return pagingHandler.getPage(offset);
  }



  async getAllUsersByOrgIdWithOffsetPaging(
    orgId,
    pageSize: number,
    offset?: any,
    orderBy?: object,
    include?: object,
  ): Promise<OffsetPaginationDTO<UserSummary>> {
    let whereQuery = {
      orgsThisUserBelongTo: {
        some: {
          orgId: orgId,
        },
      },
    };

    return this.getAllUsersWithOffsetPaging(
      whereQuery,
      pageSize,
      offset,
      orderBy,
      include,
    );
  }

  async getUserDetailData(
    userId: string,
    isDisableEncryptPhoneNumber = false,
    include?: object,
  ): Promise<UserInfoDTO> {
    if (!userId) {
      return null;
    }

    const cacheKey = getUserCacheKey(userId);
    let userDetail = await this.redisCacheService.get(cacheKey);

    if (!userDetail) {
      const userData = await this.getUserById(userId, {
        orgsThisUserBelongTo: true,
      });
      const userInfoData = await this.getUserInfoById(userId);

      userDetail = toUserInfoDTO(userData, userInfoData);

      await this.redisCacheService.set(cacheKey, userDetail || {}, 3600);
    }

    if (include) {
      if (include['orgDetails']) {
        userDetail['orgDetails'] = userDetail['orgIds'].map((orgId) =>
          this.organizationsService.getOrgSummaryCache(orgId),
        );
      }
      if (userDetail['currentOrgId'] && include['currentOrgDetail']) {
        userDetail[
          'currentOrgDetail'
          ] = await this.organizationsService.getOrgSummaryCache(
          userDetail['currentOrgId'],
        );
      }
    }

    return !isDisableEncryptPhoneNumber
      ? encryptPhoneNumber(userDetail as UserInfoDTO)
      : (userDetail as UserInfoDTO);
  }

  async getUserById(userId: string, include?: object): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      include,
    });
    // throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getUserInfoById(userId: string): Promise<UserInfo> {
    return this.prismaService.userInfo.findUnique({ where: { userId } });
  }

  async createUserByEmailPassword(
    email: string,
    password: string,
  ): Promise<UserInfoForMakingToken> {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.prismaService.user.create({
      data: { email: sanitizeHtml(email), passwordHash },
      include: {
        roles: true,
        orgsThisUserBelongTo: true,
      },
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
        roles: true,
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
    return this.prismaService.user.findUnique({
      where: { facebookId },
      include: {
        roles: true,
        orgsThisUserBelongTo: true,
      },
    });
  }

  async getUserByGoogleId(googleId: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { googleId },
      include: {
        roles: true,
      },
    });
  }

  async getUserByEmail(email: string): Promise<UserInfoForMakingToken> {
    return this.prismaService.user.findUnique({
      where: { email },
      include: {
        roles: true,
        orgsThisUserBelongTo: true,
      },
    });
  }

  async updateLastSignedIn(userId: string): Promise<User> {
    return this.prismaService.user.update({
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
    return await this.prismaService.user.update({
      where: { id: userId },
      data: { facebookId, facebookAccessToken },
    });
  }

  async connectWithGoogleAccount(
    userId: string,
    googleId: string,
    googleAccessToken: string,
  ): Promise<User> {
    return await this.prismaService.user.update({
      where: { id: userId },
      data: { googleId, googleAccessToken },
    });
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
        avatarImage: {
          url: sample(DEFAULT_AVATARS),
        },
        coverImage: {
          url: sample(DEFAULT_COVERS),
        },
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
            updateData[field] = data[field];
          }
          break;
        case 'coverImage':
          if (data[field]) {
            await this.storageService.handleUploadImageBySignedUrlComplete(
              data[field].id,
            );
            updateData[field] = data[field];
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

  public async generateResetPasswordToken(
    email: string,
  ): Promise<{ email: string; displayName: string; token: string }> {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new Error('User not existing');
    }

    const refreshPasswordToken = this.authService.getResetPasswordToken(
      user.id,
      email,
    );

    await this.setResetPasswordToken(refreshPasswordToken, user.id);
    const userInfo = await this.getUserDetailData(user.id);

    return {
      email,
      displayName: userInfo.displayName,
      token: refreshPasswordToken,
    };
  }

  public async updatePasswordByToken(
    token: string,
    newPassword: string,
  ): Promise<User> {
    const { userId } = await this.authService.verifyResetPasswordToken(token);
    const userInfo = await this.verifyResetPasswordToken(token, userId);

    if (userInfo) {
      return await this.setUserPassword(userId, newPassword, true);
    } else {
      throw new Error('Token not valid');
    }
  }

  async signInByFacebookId(
    facebookId: string,
    fbAccessToken: string,
    userInfo: SignInUserSSOInfo,
  ): Promise<AuthDTO> {
    let user = await this.getUserByFacebookId(facebookId);

    // TODO: potential, người khác có thể ăn cắp account tạo bằng Email bang cách dùng account Facebook
    if (!user && userInfo.email) {
      user = await this.getUserByEmail(userInfo.email);
    }

    if (!user) {
      user = await this.createUserByFacebookAccount(
        facebookId,
        fbAccessToken,
        null,
      );
      await this.createTheProfileForUser(user.id, userInfo as any);
    } else if (!user.facebookId) {
      // await this.connectWithFacebookAccount(user.id, facebookId, fbAccessToken)
    }
    return this.authService.generateNewToken(null, user.id, null, {
      facebookId,
    });
  }

  async signInByGoogleId(
    googleId: string,
    googleAccessToken: string,
    userInfo: SignInUserSSOInfo,
  ): Promise<AuthDTO> {
    let user = await this.getUserByGoogleId(googleId);

    if (!user && userInfo.email) {
      user = await this.getUserByEmail(userInfo.email);
    }

    if (!user) {
      user = await this.createUserByGoogleAccount(
        googleId,
        googleAccessToken,
        null,
      );
      await this.createTheProfileForUser(user.id, userInfo as any);
    } else if (!user.googleId) {
      // await this.connectWithGoogleAccount(user.id, googleId, googleAccessToken)
    }

    return this.authService.generateNewToken(null, user.id, null);
  }

  async signUpByEmail(email: string, password: string): Promise<AuthDTO> {
    const isEmailExisted = await this.getUserByEmail(email);
    if (isEmailExisted) {
      throw new Error('This email is existed!');
    }

    const user = await this.createUserByEmailPassword(email, password);
    await this.createTheProfileForUser(user.id, {
      displayName: email.substr(0, email.indexOf('@')),
    } as any);

    return this.authService.generateNewToken(null, user.id, null);
  }

  async getNewTokenByOrg(userId, orgId) {
    return this.authService.generateNewToken(null, userId, orgId);
  }

  async loginByEmail(
    email: string,
    password: string,
    orgId?: string,
  ): Promise<AuthDTO> {
    return this.authService.loginByEmail(email, password);
  }

  async changeUserPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<AuthDTO> {
    const user = await this.changePassword(
      userId,
      currentPassword,
      newPassword,
    );

    return this.authService.generateNewToken(null, userId, user.currentOrgId);
  }

  async removeRefreshToken(userId: string): Promise<void> {
    return this.removeCurrentRefreshToken(userId);
  }

  async deleteUser(userId: string, reason: string): Promise<void> {
    const currentUserInfo = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        facebookId: currentUserInfo.facebookId?.length
          ? `deleted-${currentUserInfo.facebookId}`
          : currentUserInfo.facebookId,
        googleId: currentUserInfo.googleId?.length
          ? `deleted-${currentUserInfo.googleId}`
          : currentUserInfo.googleId,
        email: currentUserInfo.email?.length
          ? `deleted-${currentUserInfo.email}`
          : currentUserInfo.email,
        systemNote: reason || '',
        isDeleted: true,
      },
    });

    await this.prismaService.item.updateMany({
      where: {
        ownerUserId: userId,
      },
      data: {
        isDeleted: true,
      },
    });

    await this.prismaService.fileStorage.updateMany({
      where: {
        createdBy: userId,
      },
      data: {
        isDeleted: true,
      },
    });

    const cacheKey = getUserCacheKey(userId);
    await this.redisCacheService.del(cacheKey);
  }
}
