import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillStatus, BillStatusEnum } from '../models/bill-status.entity.js';
import { CreateBillStatusDto } from '../dto/create-bill-status.dto.js';
import { UpdateBillStatusDto } from '../dto/update-bill-status.dto.js';

@Injectable()
export class BillStatusService {
  constructor(
    @InjectRepository(BillStatus)
    private readonly billStatusRepository: Repository<BillStatus>,
  ) {}

  async findAll(): Promise<BillStatus[]> {
    return this.billStatusRepository.find({
      relations: { user: true, billDetails: { food: true } },
    });
  }

  async findByUser(userId: number): Promise<BillStatus[]> {
    return this.billStatusRepository.find({
      where: { userId },
      relations: { user: true, billDetails: { food: true } },
    });
  }

  async findByBill(id: number): Promise<BillStatus> {
    const billStatus = await this.billStatusRepository.findOne({
      where: { id },
      relations: { user: true, billDetails: { food: true } },
    });
    if (!billStatus) {
      throw new NotFoundException(`Bill status with id ${id} not found`);
    }
    return billStatus;
  }

  async create(createBillStatusDto: CreateBillStatusDto): Promise<BillStatus> {
    const billStatus = this.billStatusRepository.create(createBillStatusDto);
    return this.billStatusRepository.save(billStatus);
  }

  async update(
    id: number,
    updateBillStatusDto: UpdateBillStatusDto,
  ): Promise<BillStatus> {
    const billStatus = await this.findByBill(id);
    Object.assign(billStatus, updateBillStatusDto);
    return this.billStatusRepository.save(billStatus);
  }

  async markPaid(id: number): Promise<BillStatus> {
    const billStatus = await this.findByBill(id);
    billStatus.status = BillStatusEnum.PAID;
    return this.billStatusRepository.save(billStatus);
  }

  async markCancelled(id: number): Promise<BillStatus> {
    const billStatus = await this.findByBill(id);
    billStatus.status = BillStatusEnum.CANCELLED;
    return this.billStatusRepository.save(billStatus);
  }
}
