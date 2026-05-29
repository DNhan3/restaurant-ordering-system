import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BillStatusEnum } from '../models/bill-status.entity.js';

export class CreateBillStatusDto {
  @IsInt()
  userId!: number;

  @IsOptional()
  @IsEnum(BillStatusEnum)
  status?: BillStatusEnum;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  deliveryFee?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsBoolean()
  paid?: boolean;
}
