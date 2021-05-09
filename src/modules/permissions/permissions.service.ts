import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) {}

  public getAvailablePermissionsForOrg(): Promise<Permission[]> {
    return this.prismaService.permission.findMany({
      where: {
        isInternal: false,
      },
    });
  }
}
