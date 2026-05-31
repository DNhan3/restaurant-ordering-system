import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillStatus, BillStatusEnum } from '../models/bill-status.entity.js';
import { CreateBillStatusDto } from '../dto/create.dto.js';
import { UpdateBillStatusDto } from '../dto/update.dto.js';
import { mapBillStatusResponse } from './response-mappers.js';

const ORDER_STATUS_FLOW = [
  BillStatusEnum.CONFIRMED,
  BillStatusEnum.PREPARING,
  BillStatusEnum.CHECKING,
  BillStatusEnum.DELIVERING,
  BillStatusEnum.DELIVERED,
  BillStatusEnum.COMPLETED,
];

@Injectable()
export class BillStatusService {
  constructor(
    @InjectRepository(BillStatus)
    private readonly billStatusRepository: Repository<BillStatus>,
  ) {}

  async findAll() {
    const billStatuses = await this.billStatusRepository.find({
      relations: { user: true, shipper: true, billDetails: { food: true } },
      order: { createdAt: 'DESC' },
    });
    return billStatuses.map(mapBillStatusResponse);
  }

  async getNextBillId(): Promise<number> {
    const result = await this.billStatusRepository
      .createQueryBuilder('billStatus')
      .select('MAX(billStatus.id)', 'max')
      .getRawOne<{ max: string | null }>();

    return Number(result?.max ?? 0) + 1;
  }

  async findByUser(userId: number) {
    const billStatuses = await this.billStatusRepository.find({
      where: { userId },
      relations: { user: true, shipper: true, billDetails: { food: true } },
      order: { createdAt: 'DESC' },
    });
    return billStatuses.map(mapBillStatusResponse);
  }

  async findByBill(id: number) {
    return mapBillStatusResponse(await this.findEntity(id));
  }

  async create(createBillStatusDto: CreateBillStatusDto) {
    const billStatus = this.billStatusRepository.create({
      ...createBillStatusDto,
      status: createBillStatusDto.status ?? BillStatusEnum.CONFIRMED,
      paid: createBillStatusDto.paid ?? false,
    });
    const saved = await this.billStatusRepository.save(billStatus);
    return mapBillStatusResponse(await this.findEntity(saved.id));
  }

  async update(id: number, updateBillStatusDto: UpdateBillStatusDto) {
    const billStatus = await this.findEntity(id);

    if (updateBillStatusDto && Object.keys(updateBillStatusDto).length > 0) {
      Object.assign(billStatus, updateBillStatusDto);
      const saved = await this.billStatusRepository.save(billStatus);
      return mapBillStatusResponse(await this.findEntity(saved.id));
    }

    billStatus.status = this.getNextStatus(billStatus.status);
    const saved = await this.billStatusRepository.save(billStatus);
    return mapBillStatusResponse(await this.findEntity(saved.id));
  }

  async markPaid(id: number) {
    const billStatus = await this.findEntity(id);
    billStatus.paid = true;
    if (
      billStatus.status === BillStatusEnum.PENDING ||
      billStatus.status === BillStatusEnum.PAID
    ) {
      billStatus.status = BillStatusEnum.CONFIRMED;
    }
    const saved = await this.billStatusRepository.save(billStatus);
    return mapBillStatusResponse(await this.findEntity(saved.id));
  }

  async markCancelled(id: number) {
    const billStatus = await this.findEntity(id);
    billStatus.status = BillStatusEnum.CANCELLED;
    const saved = await this.billStatusRepository.save(billStatus);
    return mapBillStatusResponse(await this.findEntity(saved.id));
  }

  private async findEntity(id: number): Promise<BillStatus> {
    const billStatus = await this.billStatusRepository.findOne({
      where: { id },
      relations: { user: true, shipper: true, billDetails: { food: true } },
    });
    if (!billStatus) {
      throw new NotFoundException(`Bill status with id ${id} not found`);
    }
    return billStatus;
  }

  private getNextStatus(currentStatus: BillStatusEnum): BillStatusEnum {
    if (currentStatus === BillStatusEnum.CANCELLED) {
      return BillStatusEnum.CANCELLED;
    }

    const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex < 0) {
      return BillStatusEnum.CONFIRMED;
    }

    return ORDER_STATUS_FLOW[
      Math.min(currentIndex + 1, ORDER_STATUS_FLOW.length - 1)
    ];
  }
}
