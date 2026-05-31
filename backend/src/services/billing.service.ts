import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillDetail } from '../models/bill-detail.entity.js';
import { BillStatus, BillStatusEnum } from '../models/bill-status.entity.js';
import { mapBillStatusResponse, mapFoodResponse } from './response-mappers.js';

type CheckoutItem = {
  foodId?: number;
  food_id?: number;
  quantity?: number;
  item_qty?: number;
  price?: number | string;
};

type CheckoutBody = {
  userId?: number;
  user_id?: number;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  discount?: number;
  deliveryFee?: number;
  total?: number;
  paid?: boolean;
  items?: CheckoutItem[];
};

const STATUS_LABELS: Record<BillStatusEnum, string> = {
  [BillStatusEnum.CANCELLED]: 'Cancelled',
  [BillStatusEnum.CONFIRMED]: 'Confirmed',
  [BillStatusEnum.PREPARING]: 'Preparing',
  [BillStatusEnum.CHECKING]: 'Checking',
  [BillStatusEnum.DELIVERING]: 'Delivering',
  [BillStatusEnum.DELIVERED]: 'Delivered',
  [BillStatusEnum.COMPLETED]: 'Completed',
  [BillStatusEnum.PENDING]: 'Pending',
  [BillStatusEnum.PAID]: 'Paid',
};

const toNumber = (value: unknown, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(BillStatus)
    private readonly billStatusRepository: Repository<BillStatus>,
    @InjectRepository(BillDetail)
    private readonly billDetailRepository: Repository<BillDetail>,
  ) {}

  async checkout(body: unknown) {
    const checkout = body as CheckoutBody;
    const userId = Number(checkout.userId ?? checkout.user_id);
    const items = checkout.items ?? [];

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('checkout requires at least one item');
    }

    const bill = await this.billStatusRepository.manager.transaction(
      async (manager) => {
        const billStatusRepository = manager.getRepository(BillStatus);
        const billDetailRepository = manager.getRepository(BillDetail);

        const billStatus = await billStatusRepository.save(
          billStatusRepository.create({
            userId,
            status: BillStatusEnum.CONFIRMED,
            phone: checkout.phone ?? '',
            address: checkout.address ?? '',
            paymentMethod: checkout.paymentMethod ?? 'cash',
            total: Number(checkout.total ?? 0),
            discount: Number(checkout.discount ?? 0),
            deliveryFee: Number(checkout.deliveryFee ?? 0),
            paid: checkout.paid ?? checkout.paymentMethod === 'card',
          }),
        );

        const billDetails = items.map((item) => {
          const foodId = Number(item.foodId ?? item.food_id);
          const quantity = Number(item.quantity ?? item.item_qty ?? 1);
          const price = Number(item.price ?? 0);

          if (!foodId || quantity < 1) {
            throw new BadRequestException(
              'checkout items require foodId and quantity',
            );
          }

          return billDetailRepository.create({
            billStatusId: billStatus.id,
            foodId,
            quantity,
            price,
          });
        });

        await billDetailRepository.save(billDetails);

        return billStatusRepository.findOne({
          where: { id: billStatus.id },
          relations: { user: true, shipper: true, billDetails: { food: true } },
        });
      },
    );

    return {
      message: 'Bill created',
      order: mapBillStatusResponse(bill),
      bill: mapBillStatusResponse(bill),
    };
  }

  async findUserInvoices(userId: number) {
    const bills = await this.billStatusRepository.find({
      where: { userId },
      relations: { user: true, shipper: true, billDetails: { food: true } },
      order: { createdAt: 'DESC' },
    });

    return bills.map((bill) => this.mapInvoice(bill));
  }

  async findInvoice(id: number) {
    return this.mapInvoice(await this.findEntity(id));
  }

  async getSummary() {
    const bills = await this.billStatusRepository.find({
      relations: { billDetails: true },
    });

    const totals = bills.reduce(
      (summary, bill) => {
        const total = toNumber(bill.total);
        summary.totalBills += 1;
        summary.totalRevenue += total;

        if (bill.paid) {
          summary.paidBills += 1;
          summary.paidRevenue += total;
        } else {
          summary.unpaidBills += 1;
          summary.unpaidRevenue += total;
        }

        summary.byStatus[bill.status] =
          (summary.byStatus[bill.status] ?? 0) + 1;
        return summary;
      },
      {
        totalBills: 0,
        paidBills: 0,
        unpaidBills: 0,
        totalRevenue: 0,
        paidRevenue: 0,
        unpaidRevenue: 0,
        byStatus: {},
      },
    );

    return {
      ...totals,
      averageBill:
        totals.totalBills > 0 ? totals.totalRevenue / totals.totalBills : 0,
    };
  }

  private async findEntity(id: number): Promise<BillStatus> {
    const bill = await this.billStatusRepository.findOne({
      where: { id },
      relations: { user: true, shipper: true, billDetails: { food: true } },
    });

    if (!bill) {
      throw new NotFoundException(`Bill with id ${id} not found`);
    }

    return bill;
  }

  private mapInvoice(bill: BillStatus) {
    const items =
      bill.billDetails?.map((detail) => {
        const unitPrice = toNumber(detail.price);
        const quantity = toNumber(detail.quantity);

        return {
          bill_detail_id: detail.id,
          food_id: detail.foodId,
          item_qty: quantity,
          item_price: unitPrice,
          line_total: unitPrice * quantity,
          food: mapFoodResponse(detail.food),
        };
      }) ?? [];

    const itemSubtotal = items.reduce((sum, item) => sum + item.line_total, 0);
    const discount = toNumber(bill.discount);
    const deliveryFee = toNumber(bill.deliveryFee);
    const total = toNumber(bill.total, itemSubtotal - discount + deliveryFee);

    return {
      bill_id: bill.id,
      user_id: bill.userId,
      customer: bill.user
        ? {
            user_id: bill.user.id,
            user_name: bill.user.name,
            user_email: bill.user.email,
          }
        : null,
      bill_status: bill.status,
      bill_status_label: STATUS_LABELS[bill.status] ?? bill.status,
      bill_paid: bill.paid,
      bill_total: total,
      bill_subtotal: itemSubtotal,
      bill_discount: discount,
      bill_delivery: deliveryFee,
      bill_amount_due: bill.paid ? 0 : total,
      bill_phone: bill.phone ?? '',
      bill_address: bill.address ?? '',
      bill_payment_method: bill.paymentMethod ?? 'cash',
      bill_when: bill.createdAt,
      bill_details: items,
    };
  }
}
