import { IsInt, IsOptional, Min } from 'class-validator';

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
