import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { PrismaService } from '../prisma/prisma.service'
import {
  User,
  UserRole,
  UserInfo
} from '@prisma/client';
import { StoragesService } from '../storages/storages.service'
import { UserInfoInputDTO, UserInfoDTO } from './user-info.dto'
import { RedisCacheService } from '../redis-cache/redis-cache.service'

function toUserInfoDTO(user: User, userInfo: UserInfo): UserInfoDTO {
  return {
    ...userInfo,
    id: user.id,
    createdDate: userInfo?.createdDate.getTime(),
    avatarImage: userInfo?.avatarImage && userInfo.avatarImage.length ? JSON.parse(userInfo.avatarImage) : [],
    coverImage: userInfo?.coverImage && userInfo.coverImage.length ? JSON.parse(userInfo.coverImage) : [],
    email: user?.email
  }
}

function getUserCacheKey(userId: string) {
  return `USER_INFO_${userId}`
}

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StoragesService,
    private redisCacheService: RedisCacheService
  ) {}

  async getUserDetailData(userId: string): Promise<UserInfoDTO> {
    const cacheKey = getUserCacheKey(userId)
    let userDetail = await this.redisCacheService.get(cacheKey)

    if (userDetail) {
      return userDetail
    }

    const userData = await this.getUserById(userId);
    const userInfoData = await this.getUserInfoById(userId);

    userDetail = toUserInfoDTO(userData, userInfoData)

    this.redisCacheService.set(cacheKey, userDetail, 3600)

    return userDetail
  }

  async getUserById(userId: string): Promise<User> {
    return this.prismaService.user.findOne({ where: { id: userId } })
    // throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getUserInfoById(userId: string): Promise<UserInfo> {
    return this.prismaService.userInfo.findOne({ where: { id: userId } })
  }

  async createUserByEmailPassword(email: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10) 
    return this.prismaService.user.create({ data: { email, passwordHash, role: [ UserRole.User ] } })
  }

  async createUserByFacebookAccount(facebookId: string, facebookAccessToken: string, email: string = null): Promise<User> {
    return this.prismaService.user.create({ data: { facebookId, facebookAccessToken, email, role: [ UserRole.User ] } })
  }

  async createUserByGoogleAccount(googleId: string, googleAccessToken: string, email: string = null): Promise<User> {
    return this.prismaService.user.create({ data: { googleId, googleAccessToken, email, role: [ UserRole.User ] } })
  }

  async getUserByFacebookId(facebookId: string): Promise<User> {
    const user = await this.prismaService.user.findOne({ where: { facebookId } })

    return user
  }

  async getUserByGoogleId(googleId: string): Promise<User> {
    const user = await this.prismaService.user.findOne({ where: { googleId } })

    return user
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findOne({ where: { email } })

    return user
  }

  async connectWithFacebookAccount(userId: string, facebookId: string, facebookAccessToken: string): Promise<User> {
    const user = await this.prismaService.user.update({ where: { id: userId }, data: { facebookId, facebookAccessToken } })

    return user
  }

  async connectWithGoogleAccount(userId: string, googleId: string, googleAccessToken: string): Promise<User> {
    const user = await this.prismaService.user.update({ where: { id: userId }, data: { googleId, googleAccessToken } })

    return user
  }

  async getUserByEmailPassword(email: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findOne({ where: { email } })
    if (!user) {
      throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      throw new Error('Invalid password')
    }

    return user
  }

  async removeCurrentRefreshToken(userId: string) {
    await this.prismaService.user.update({
      where: {
        id: userId
      },
      data: {
        currentHashedRefreshToken: null
      }
    })
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prismaService.user.update({
      where: {
        id: userId
      },
      data: {
        currentHashedRefreshToken
      }
    })
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId)
 
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
 
    if (isRefreshTokenMatching) {
      return user;
    }
  }
  
  async createTheProfileForUser(userId: string, info: UserInfo): Promise<UserInfo> {
    return await this.prismaService.userInfo.create({
      data: {
        ...info,
        id: userId
      }
    })
  }

  async updateUserProfile(userId: string, data: UserInfoInputDTO): Promise<UserInfo> {
    const ALLOW_UPDATE_FIELDS = ['displayName', 'bio', 'avatarImage', 'coverImage']
    const updateData: any = {}

    for (let i = 0; i < ALLOW_UPDATE_FIELDS.length; i++) {
      let field = ALLOW_UPDATE_FIELDS[i]

      switch (field) {
        case 'avatarImage':
          if (data[field] && Array.isArray(data[field])) {
            const images: any = data[field]
            images.forEach((image) => {
              this.storageService.handleUploadImageBySignedUrlComplete(image.id, ['small', 'medium'])
            })
            updateData[field] = JSON.stringify(images)
          }
          break
        case 'coverImage':
          if (data[field] && Array.isArray(data[field])) {
            const images: any = data[field]
            images.forEach((image) => {
              this.storageService.handleUploadImageBySignedUrlComplete(image.id)
            })
            updateData[field] = JSON.stringify(images)
          }
          break
        default:
          updateData[field] = data[field]
          break
      }
    }

    return await this.prismaService.userInfo.update({
      where: {
        id: userId
      },
      data: updateData
    })
  }
}
