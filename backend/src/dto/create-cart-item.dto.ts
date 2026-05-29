import { IsInt, IsOptional, Min } from 'class-validator';

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
