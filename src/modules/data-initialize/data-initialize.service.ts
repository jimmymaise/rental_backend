import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
// import { WishingItem } from '@prisma/client';

@Injectable()
export class DataInitilizeService {
  constructor(private prismaService: PrismaService) {}
}
