import { Injectable } from '@nestjs/common';
import { getOrgCacheKey } from '@helpers/common';
import { Organization } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '@modules/auth/auth.service';
import {
  CreateOrganizationDto,
  UpdateMyOrganizationDto,
  OrganizationSummaryCacheDto,
} from './organizations.dto';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { Permission } from '@modules/auth/permission/permission.enum';

@Injectable()
export class OrganizationsService {
  constructor(
    private prismaService: PrismaService,
    public authService: AuthService,
    public redisCacheService: RedisCacheService,
  ) {
  }

  async getOrganization(orgId: string, include: any): Promise<Organization> {
    return this.prismaService.organization.findUnique({
      where: { id: orgId },
      include: include,
    });
  }

  async createOrganization(
    createOrganizationData: CreateOrganizationDto,
    userId?: string,
    include?: any,
  ): Promise<Organization> {
    createOrganizationData['createdBy'] = userId;
    const organizationCreatedResult = await this.prismaService.organization.create(
      {
        include: include,
        data: {
          ...createOrganizationData,
          createdBy: userId,
          employees: {
            create: [{ userId: userId, isOwner: true }],
          },
        },
      },
    );

    // Create default Role
    await this.prismaService.role.create({
      data: {
        name: 'Admin',
        description: 'Admin',
        isDefault: true,
        org: {
          connect: {
            id: organizationCreatedResult.id,
          },
        },
        users: {
          connect: {
            id: userId,
          },
        },
        permissions: {
          connect: {
            name: Permission.ORG_MASTER,
          },
        },
      },
    });

    return organizationCreatedResult;
  }

  async updateOrganization(
    updateMyOrganizationData: UpdateMyOrganizationDto,
    orgId: string,
    include?: any,
  ): Promise<Organization> {
    const employeesAdded = (updateMyOrganizationData['addEmployeesToOrgByUserId'] || []).map(
      (employeeUserId) => {
        return {
          create: { userId: employeeUserId },
          where: {
            userId_orgId: { userId: employeeUserId, orgId: orgId },
          },
        };
      },
    );
    const employeesRemoved = (
      updateMyOrganizationData['removeEmployeesFromOrgByUserId'] || []
    ).map((employeeUserId) => {
      return { userId_orgId: { userId: employeeUserId, orgId: orgId } };
    });
    const setOwner = updateMyOrganizationData['setOwner'];
    delete updateMyOrganizationData['addEmployeesToOrgByUserId'];
    delete updateMyOrganizationData['removeEmployeesFromOrgByUserId'];
    delete updateMyOrganizationData['setOwner'];

    const employeeUpdateCommand = {};

    if (employeesAdded.length > 0) {
      employeeUpdateCommand['connectOrCreate'] = employeesAdded;
    }

    if (employeesRemoved.length > 0) {
      employeeUpdateCommand['delete'] = employeesRemoved;
    }

    if (setOwner) {
      employeeUpdateCommand['update'] = {
        where: {
          userId: setOwner.userId, orgId: orgId,
        },
        data: {
          isOwner: setOwner.isOwner,
        },
      };
    }

    return this.prismaService.organization.update({
      include: include,
      where: { id: orgId },
      data: {
        ...updateMyOrganizationData,
        employees: {
          ...employeeUpdateCommand,
        },
      },
    });
  }

  async convertFullOrgDataToSummaryOrgInfo(
    fullOrgData: Organization,
  ): Promise<OrganizationSummaryCacheDto> {
    return {
      name: fullOrgData.name,
      avatarImage: fullOrgData.avatarImage as any,
      description: fullOrgData.description,
      id: fullOrgData.id,
      slug: fullOrgData.slug,
    };
  }

  async getOrgSummaryCache(orgId: string) {
    const cacheKey = getOrgCacheKey(orgId);
    let orgSummaryCache = await this.redisCacheService.get(cacheKey);
    if (!orgSummaryCache) {
      const fullOrgData = await this.getOrganization(orgId, null);
      orgSummaryCache = this.convertFullOrgDataToSummaryOrgInfo(fullOrgData);
      await this.redisCacheService.set(cacheKey, fullOrgData || {}, 3600);
    }
    return orgSummaryCache;
  }
}
