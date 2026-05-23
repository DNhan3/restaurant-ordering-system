import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { BillStatusEnum } from '../models/bill-status.entity.js';

export class UpdateBillStatusDto {
  @IsOptional()
  @IsEnum(BillStatusEnum)
  status?: BillStatusEnum;

  @IsOptional()
  @IsNumber()
  total?: number;
}
