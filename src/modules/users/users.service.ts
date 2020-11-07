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
  }

  async createUserByEmailPassword(email: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10) 
    return this.prismaService.user.create({ data: { email, passwordHash, role: [ UserRole.User ] } })
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
}
