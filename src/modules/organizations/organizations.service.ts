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

@Injectable()
export class OrganizationsService {
  constructor(
    private prismaService: PrismaService,
    public authService: AuthService,
    public redisCacheService: RedisCacheService,
  ) {}

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
          users: {
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
        orgId: organizationCreatedResult.id,
        users: {
          connect: {
            id: userId,
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
    const usersAdded = (updateMyOrganizationData['addUsersToOrg'] || []).map(
      (user) => {
        // return { userId: user };

        return {
          create: { userId: user },
          where: {
            userId_orgId: { userId: user, orgId: orgId },
          },
        };
      },
    );
    const usersRemoved = (
      updateMyOrganizationData['removeUsersFromOrg'] || []
    ).map((user) => {
      return { userId_orgId: { userId: user, orgId: orgId } };
    });
    const setOwner = updateMyOrganizationData['setOwner'];
    delete updateMyOrganizationData['addUsersToOrg'];
    delete updateMyOrganizationData['removeUsersFromOrg'];
    delete updateMyOrganizationData['setOwner'];

    const userOrgUpdateCommand = {};

    if (usersAdded.length > 0) {
      userOrgUpdateCommand['connectOrCreate'] = usersAdded;
    }

    if (usersRemoved.length > 0) {
      userOrgUpdateCommand['delete'] = usersRemoved;
    }

    if (setOwner) {
      userOrgUpdateCommand['update'] = {
        where: {
          userId_orgId: { userId: setOwner.userId, orgId: orgId },
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
        users: {
          ...userOrgUpdateCommand,
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
