import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillDetail } from '../models/bill-detail.entity.js';
import { CreateBillDetailDto } from '../dto/create-bill-detail.dto.js';

@Injectable()
export class BillDetailsService {
  constructor(
    @InjectRepository(BillDetail)
    private readonly billDetailRepository: Repository<BillDetail>,
  ) {}

  async create(createBillDetailDto: CreateBillDetailDto): Promise<BillDetail> {
    const billDetail = this.billDetailRepository.create(createBillDetailDto);
    return this.billDetailRepository.save(billDetail);
  }

  async findOne(id: number): Promise<BillDetail> {
    const billDetail = await this.billDetailRepository.findOne({
      where: { id },
      relations: { billStatus: true, food: true },
    });
    if (!billDetail) {
      throw new NotFoundException(`Bill detail with id ${id} not found`);
    }
    return billDetail;
  }
}
