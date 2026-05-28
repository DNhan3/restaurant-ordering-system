import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { BillDetailsService } from '../services/bill-details.service.js';
import { CreateBillDetailDto } from '../dto/create.dto.js';

@Controller('bill-details')
export class BillDetailsController {
  constructor(private readonly billDetailsService: BillDetailsService) { }

  @Post()
  create(@Body() createBillDetailDto: CreateBillDetailDto) {
    return this.billDetailsService.create(createBillDetailDto);
  }

  @Get('bill/:billStatusId')
  findByBillStatus(@Param('billStatusId', ParseIntPipe) billStatusId: number) {
    return this.billDetailsService.findByBillStatus(billStatusId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.billDetailsService.findOne(id);
  }
}
