import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsEmail,
  Min,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { BillStatusEnum } from '../models/bill-status.entity';

export class CreateBillDetailDto {
  @IsInt()
  billStatusId!: number;

  @IsInt()
  foodId!: number;

  @IsInt()
  quantity!: number;

  @IsNumber()
  price!: number;
}

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

export class CreateBookingDto {
  @IsString()
  book_name!: string;

  @IsInt()
  book_phone!: number;

  @IsInt()
  book_people!: number;

  @IsOptional()
  @IsInt()
  book_tables?: number;

  @IsInt()
  user_id!: number | null;

  @IsString()
  book_when!: string;

  @IsString()
  book_note!: string;
}

export class CreateCartItemDto {
  @IsInt()
  userId!: number;

  @IsInt()
  foodId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class CreateFoodDto {
  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

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

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  role?: string;
}
