import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, In, Repository } from 'typeorm';
import { BillStatus, BillStatusEnum } from '../models/bill-status.entity.js';
import { User } from '../models/user.entity.js';
import { mapBillStatusResponse } from './response-mappers.js';

const BILL_RELATIONS = {
  user: true,
  shipper: true,
  billDetails: { food: true },
};

/** Statuses that appear in the shipper's "available orders" list */
const AVAILABLE_STATUSES = [
  BillStatusEnum.CONFIRMED,
  BillStatusEnum.PREPARING,
  BillStatusEnum.CHECKING,
];

/** Statuses that count as "active" for the one-order-at-a-time rule */
const ACTIVE_STATUSES = [
  BillStatusEnum.CONFIRMED,
  BillStatusEnum.PREPARING,
  BillStatusEnum.CHECKING,
  BillStatusEnum.DELIVERING,
];

@Injectable()
export class ShipperService {
  constructor(
    @InjectRepository(BillStatus)
    private readonly billStatusRepository: Repository<BillStatus>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  /** Orders that have no shipper and are in an assignable status */
  async availableOrders() {
    const orders = await this.billStatusRepository.find({
      where: {
        shipperId: IsNull(),
        status: In(AVAILABLE_STATUSES),
      },
      relations: BILL_RELATIONS,
      order: { createdAt: 'ASC' },
    });
    return orders.map(mapBillStatusResponse);
  }

  /** The shipper's currently active order (null if none) */
  async myOrder(shipperId: number) {
    const order = await this.billStatusRepository.findOne({
      where: {
        shipperId,
        status: In(ACTIVE_STATUSES),
      },
      relations: BILL_RELATIONS,
    });
    return order ? mapBillStatusResponse(order) : null;
  }

  /** Accept an order — only if the shipper has no active order */
  async accept(billId: number, shipperId: number) {
    const existing = await this.billStatusRepository.findOne({
      where: {
        shipperId,
        status: In(ACTIVE_STATUSES),
      },
    });
    if (existing) {
      throw new BadRequestException(
        'You already have an active order. Complete or deny it first.',
      );
    }

    const bill = await this.findEntity(billId);
    if (bill.shipperId) {
      throw new BadRequestException('This order has already been taken by another shipper.');
    }
    if (!AVAILABLE_STATUSES.includes(bill.status)) {
      throw new BadRequestException('This order is no longer available for pickup.');
    }

    bill.shipperId = shipperId;
    const saved = await this.billStatusRepository.save(bill);
    return mapBillStatusResponse(await this.findEntity(saved.id));
  }

  /** Deny / release an accepted order back to the pool */
  async deny(billId: number, shipperId: number) {
    const bill = await this.findEntity(billId);
    if (bill.shipperId !== shipperId) {
      throw new BadRequestException('This order is not assigned to you.');
    }
    if (bill.status === BillStatusEnum.DELIVERING) {
      throw new BadRequestException('Cannot deny an order that is already being delivered.');
    }

    bill.shipperId = null;
    const saved = await this.billStatusRepository.save(bill);
    return mapBillStatusResponse(await this.findEntity(saved.id));
  }

  /** Pick up the order — sets status to DELIVERING */
  async pickup(billId: number, shipperId: number) {
    const bill = await this.findEntity(billId);
    if (bill.shipperId !== shipperId) {
      throw new BadRequestException('This order is not assigned to you.');
    }
    if (bill.status !== BillStatusEnum.CHECKING) {
      throw new BadRequestException(
        'The food is not ready for pickup yet. Current status: ' + bill.status,
      );
    }

    bill.status = BillStatusEnum.DELIVERING;
    const saved = await this.billStatusRepository.save(bill);
    return mapBillStatusResponse(await this.findEntity(saved.id));
  }

  /** Mark order as delivered */
  async delivered(billId: number, shipperId: number) {
    const bill = await this.findEntity(billId);
    if (bill.shipperId !== shipperId) {
      throw new BadRequestException('This order is not assigned to you.');
    }
    if (bill.status !== BillStatusEnum.DELIVERING) {
      throw new BadRequestException('This order is not in delivering status.');
    }

    bill.status = BillStatusEnum.DELIVERED;
    const saved = await this.billStatusRepository.save(bill);
    return mapBillStatusResponse(await this.findEntity(saved.id));
  }

  /** Authenticate a shipper by email + password */
  async login(email: string, password: string) {
    const bcrypt = await import('bcryptjs');
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (user.role !== 'shipper') {
      throw new BadRequestException('This account is not a shipper account.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }
    const { password: _pw, ...rest } = user as any;
    return { message: 'Shipper login successful', user: rest };
  }

  private async findEntity(id: number): Promise<BillStatus> {
    const bill = await this.billStatusRepository.findOne({
      where: { id },
      relations: BILL_RELATIONS,
    });
    if (!bill) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return bill;
  }
}