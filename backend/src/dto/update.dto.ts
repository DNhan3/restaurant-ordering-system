import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BillStatusEnum } from '../models/bill-status.entity.js';

export class UpdateBillStatusDto {
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

  @IsOptional()
  @IsInt()
  shipperId?: number | null;
}

export class UpdateCartItemDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  foodId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class UpdateFoodDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
