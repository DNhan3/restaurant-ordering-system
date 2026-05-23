import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateBillStatusDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsNumber()
  total?: number;
}
