import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { BillDetailsService } from '../services/bill-details.service.js';
import { CreateBillDetailDto } from '../dto/create-bill-detail.dto.js';

@Controller('bill-details')
export class BillDetailsController {
  constructor(private readonly billDetailsService: BillDetailsService) {}

  @Post()
  create(@Body() createBillDetailDto: CreateBillDetailDto) {
    return this.billDetailsService.create(createBillDetailDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.billDetailsService.findOne(id);
  }
}
