import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillDetail } from '../models/bill-detail.entity.js';
import { BillStatus, BillStatusEnum } from '../models/bill-status.entity.js';
import { mapBillStatusResponse } from './response-mappers.js';

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
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  total?: number;
  paid?: boolean;
  items?: CheckoutItem[];
};

@Injectable()
export class OrdersService {
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

    const order = await this.billStatusRepository.manager.transaction(
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
            throw new BadRequestException('checkout items require foodId and quantity');
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
          relations: { user: true, billDetails: { food: true } },
        });
      },
    );

    return {
      message: 'Order created',
      order: mapBillStatusResponse(order),
    };
  }

  async findCustomerOrders() {
    const orders = await this.billStatusRepository.find({
      relations: { user: true, billDetails: { food: true } },
      order: { createdAt: 'DESC' },
    });
    return orders.map(mapBillStatusResponse);
  }

  async findOne(id: string) {
    const order = await this.billStatusRepository.findOne({
      where: { id: Number(id) },
      relations: { user: true, billDetails: { food: true } },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return mapBillStatusResponse(order);
  }
}
