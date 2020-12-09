import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { PrismaService } from '../prisma/prisma.service'
import {
  User,
  UserRole
} from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService
  ) {}

  async getUserById(userId: string): Promise<User> {
    return this.prismaService.user.findOne({ where: { id: userId } })
    // throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async createUserByEmailPassword(email: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10) 
    return this.prismaService.user.create({ data: { email, passwordHash, role: [ UserRole.User ] } })
  }

  async createUserByFacebookAccount(facebookId: string, facebookAccessToken: string): Promise<User> {
    return this.prismaService.user.create({ data: { facebookId, facebookAccessToken, role: [ UserRole.User ] } })
  }

  async createUserByGoogleAccount(googleId: string, googleAccessToken: string): Promise<User> {
    return this.prismaService.user.create({ data: { googleId, googleAccessToken, role: [ UserRole.User ] } })
  }

  async getUserByFacebookId(facebookId: string): Promise<User> {
    const user = await this.prismaService.user.findOne({ where: { facebookId } })
    if (!user) {
      throw new Error('No such user found')
    }

    return user
  }

  async getUserByGoogleId(googleId: string): Promise<User> {
    const user = await this.prismaService.user.findOne({ where: { googleId } })
    if (!user) {
      throw new Error('No such user found')
    }

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
  
}
