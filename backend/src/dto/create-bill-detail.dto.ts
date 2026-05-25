import { IsInt, IsNumber } from 'class-validator';

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
