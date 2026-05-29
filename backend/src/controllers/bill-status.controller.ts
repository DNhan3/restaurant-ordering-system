import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { BillStatusService } from '../services/bill-status.service.js';
import { CreateBillStatusDto } from '../dto/create.dto.js';
import { UpdateBillStatusDto } from '../dto/update.dto.js';

@Controller('bill-status')
export class BillStatusController {
  constructor(private readonly billStatusService: BillStatusService) { }

  @Get()
  findAll() {
    return this.billStatusService.findAll();
  }

  @Get('new')
  getNextBillId() {
    return this.billStatusService.getNextBillId();
  }

  @Get('user/:id')
  findByUser(@Param('id', ParseIntPipe) id: number) {
    return this.billStatusService.findByUser(id);
  }

  @Get('bill/:id')
  findByBill(@Param('id', ParseIntPipe) id: number) {
    return this.billStatusService.findByBill(id);
  }

  @Post()
  create(@Body() createBillStatusDto: CreateBillStatusDto) {
    return this.billStatusService.create(createBillStatusDto);
  }

  @Put('paid/:id')
  markPaid(@Param('id', ParseIntPipe) id: number) {
    return this.billStatusService.markPaid(id);
  }

  @Put('cancel/:id')
  markCancelled(@Param('id', ParseIntPipe) id: number) {
    return this.billStatusService.markCancelled(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillStatusDto: UpdateBillStatusDto,
  ) {
    return this.billStatusService.update(id, updateBillStatusDto);
  }
}