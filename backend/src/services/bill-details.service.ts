import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillDetail } from '../models/bill-detail.entity.js';
import { CreateBillDetailDto } from '../dto/create-bill-detail.dto.js';
import { mapBillDetailResponse } from './response-mappers.js';

@Injectable()
export class BillDetailsService {
  constructor(
    @InjectRepository(BillDetail)
    private readonly billDetailRepository: Repository<BillDetail>,
  ) {}

  async create(createBillDetailDto: CreateBillDetailDto) {
    const billDetail = this.billDetailRepository.create(createBillDetailDto);
    return mapBillDetailResponse(await this.billDetailRepository.save(billDetail));
  }

  async findByBillStatus(billStatusId: number) {
    const details = await this.billDetailRepository.find({
      where: { billStatusId },
      relations: { billStatus: true, food: true },
    });
    return details.map(mapBillDetailResponse);
  }

  async findOne(id: number) {
    const billDetail = await this.billDetailRepository.findOne({
      where: { id },
      relations: { billStatus: true, food: true },
    });
    if (!billDetail) {
      throw new NotFoundException(`Bill detail with id ${id} not found`);
    }
    return mapBillDetailResponse(billDetail);
  }
}
