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

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  book_name?: string;

  @IsOptional()
  @IsInt()
  book_phone?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  book_people?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  book_tables?: number;

  @IsOptional()
  @IsInt()
  user_id?: number | null;

  @IsOptional()
  @IsString()
  book_when?: string;

  @IsOptional()
  @IsString()
  book_note?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
