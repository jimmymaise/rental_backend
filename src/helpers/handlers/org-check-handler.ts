import { PrismaService } from '@modules/prisma/prisma.service';

export class OrgCheckHandler {
  prismaService: PrismaService;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  async isAllUsersInOrg(orgId, users) {
    let uniqueUsers = [...new Set(users)];
    const countUsersInOrg = await this.prismaService.userOrganizations.count({
      where: {
        orgId: orgId,
        userId: { in: users },
      },
    });
    return uniqueUsers.length === countUsersInOrg;
  }
}
