import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { PrismaService } from '../prisma/prisma.service'
import {
  Area,
} from '@prisma/client';

@Injectable()
export class AreasService {
  constructor(
    private prismaService: PrismaService
  ) {}

  findAll(isDisabled: boolean = false): Promise<Area[]> {
    return this.prismaService.area.findMany({ where: { isDeleted: false, isDisabled } })
  }
}
