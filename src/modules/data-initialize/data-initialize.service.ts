import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { CommonAttributesConfig } from '@prisma/client';
import {
  RentingOrderStatusCreateModel,
  RentingDepositItemStatusCreateModel,
  RentingDepositItemTypeCreateModel,
} from '@modules/custom-attributes/models';
import { PaymentMethodCreateModel } from '@modules/payment/models';

@Injectable()
export class DataInitilizeService {
  constructor(private prismaService: PrismaService) {}

  public async initDefaultDataForNewOrg(
    orgId: string,
    userId: string,
  ): Promise<void> {
    // Create default Role
    await this.prismaService.role.create({
      data: {
        name: 'Admin',
        description: 'Admin',
        isDefault: true,
        org: {
          connect: {
            id: orgId,
          },
        },
        employees: {
          connectOrCreate: {
            where: {
              userId_orgId: {
                userId: userId,
                orgId: orgId,
              },
            },
            create: {
              userId: userId,
              orgId: orgId,
            },
          },
        },
        permissions: {
          connect: {
            name: Permission.ORG_MASTER,
          },
        },
      },
    });

    const defaultOrderStatuses: CommonAttributesConfig[] = [
      RentingOrderStatusCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Đơn hàng mới',
        description: 'Đơn hàng mới được tạo',
        color: '#17b7ff',
        value: 'NEW',
        mapWithSystemStatus: 'New',
        order: 0,
      }),
      RentingOrderStatusCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Đặt giữ',
        description:
          'Đơn hàng đã được đặt giữ và sản phẩm cho thuê được đặt lịch đã được khoá',
        color: '#38d9a9',
        value: 'RESERVED',
        mapWithSystemStatus: 'Reserved',
        parentAttributeValue: 'NEW',
        order: 1,
      }),
      RentingOrderStatusCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Đã nhận hàng',
        description:
          'Khách hàng đã nhận được sản phẩm cho thuê và đang sử dụng',
        color: '#ffae63',
        value: 'PICKED_UP',
        mapWithSystemStatus: 'PickedUp',
        parentAttributeValue: 'RESERVED',
        order: 2,
      }),
      RentingOrderStatusCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Đã trả hàng',
        description:
          'Kết thúc hợp đồng cho thuê, khách hàng đã trả lại sản phẩm',
        color: '#2FCC71',
        value: 'RETURNED',
        parentAttributeValue: 'PICKED_UP',
        mapWithSystemStatus: 'Returned',
        order: 3,
      }),
      RentingOrderStatusCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Huỷ đơn',
        description: 'Vì một lý do nào đó đơn hàng đã được duyệt đã bị huỷ',
        color: '#dd5252',
        value: 'CANCELLED',
        parentAttributeValue: 'RESERVED',
        mapWithSystemStatus: 'Cancelled',
        order: 4,
      }),
    ];

    const defaultDepositItemStatuses: CommonAttributesConfig[] = [
      RentingDepositItemStatusCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        {
          label: 'Mới',
          description: 'Cọc mới tạo',
          color: '#17b7ff',
          value: 'NEW',
          mapWithSystemStatus: 'New',
          order: 0,
        },
      ),
      RentingDepositItemStatusCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        {
          label: 'Đã nhận cọc',
          description: 'Cửa hàng đã nhận và giữ  cọc của khách hàng',
          color: '#38d9a9',
          value: 'RESERVED',
          mapWithSystemStatus: 'Reserved',
          parentAttributeValue: 'NEW',
          order: 1,
        },
      ),
      RentingDepositItemStatusCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        {
          label: 'Đã trả cọc',
          description:
            'Kết thúc hợp đồng cho thuê, cửa hàng đã trả lại cọc cho khách hàng',
          color: '#2FCC71',
          value: 'RETURNED',
          mapWithSystemStatus: 'Returned',
          parentAttributeValue: 'RESERVED',
          order: 2,
        },
      ),
    ];

    const defaultDepositTypes: CommonAttributesConfig[] = [
      RentingDepositItemTypeCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        {
          label: 'Tiền mặt',
          description: 'Hình thức cọc là tiền mặt',
          value: 'CASH',
          mapWithSystemType: 'Money',
          order: 0,
        },
      ),
      RentingDepositItemTypeCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        {
          label: 'Căn cước công dân',
          description: 'Khách hàng phải cọc bản gốc căn cước công dân',
          value: 'CAN_CUOC_CONG_DAN',
          mapWithSystemType: 'Document',
          order: 1,
        },
      ),
      RentingDepositItemTypeCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        {
          label: 'Bằng lái Xe',
          description: 'Khách hàng phải cọc bản gốc bằng lái xe',
          value: 'BANG_LAI_XE',
          mapWithSystemType: 'Document',
          order: 2,
        },
      ),
      RentingDepositItemTypeCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        {
          label: 'Xe Máy',
          description: 'Cọc bằng xe máy',
          value: 'XE_MAY',
          mapWithSystemType: 'Item',
          order: 3,
        },
      ),
      RentingDepositItemTypeCreateModel.toCommonAttributesConfig(
        orgId,
        userId,
        {
          label: 'Khác',
          description: 'Cọc bằng một loại đồ nào đó',
          value: 'OTHER',
          mapWithSystemType: 'Other',
          order: 4,
        },
      ),
    ];

    const defaultPaymentMethods: CommonAttributesConfig[] = [
      PaymentMethodCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Tiền mặt',
        description: 'Thanh toán bằng tiền mặt',
        value: 'CASH',
        mapWithSystemPaymentMethod: 'Cash',
        order: 0,
      }),
      PaymentMethodCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Thẻ',
        description: 'Thanh toán bằng cách cà thẻ',
        value: 'CARD',
        mapWithSystemPaymentMethod: 'Card',
        order: 1,
      }),
      PaymentMethodCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Chuyển khoản',
        description: 'Chuyển khoản qua tất cả ngân hàng',
        value: 'BANK_TRANSFER',
        mapWithSystemPaymentMethod: 'BankTransfer',
        order: 2,
      }),
      PaymentMethodCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Ví điện tử',
        description: 'Thanh toán qua ví điện tử (Momo, Moca, ZaloPay,..)',
        value: 'MOBILE_MONEY',
        mapWithSystemPaymentMethod: 'MobileMoney',
        order: 3,
      }),
      PaymentMethodCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Voucher',
        description: 'Thanh toán bằng Voucher',
        value: 'VOUCHER',
        mapWithSystemPaymentMethod: 'PromoCode',
        order: 4,
      }),
      PaymentMethodCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Điểm thưởng',
        description: 'Thanh toán bằng Điểm thưởng',
        value: 'REWARD_POINTS',
        mapWithSystemPaymentMethod: 'RewardPoints',
        order: 5,
      }),
      PaymentMethodCreateModel.toCommonAttributesConfig(orgId, userId, {
        label: 'Khác',
        description: 'Các hình thức khác',
        value: 'OTHER',
        mapWithSystemPaymentMethod: 'Other',
        order: 6,
      }),
    ];

    await this.prismaService.commonAttributesConfig.createMany({
      data: [
        ...defaultOrderStatuses,
        ...defaultDepositItemStatuses,
        ...defaultDepositTypes,
        ...defaultPaymentMethods,
      ].map((item) => ({
        ...item,
        orgId,
        org: undefined,
      })),
    });
  }
}
