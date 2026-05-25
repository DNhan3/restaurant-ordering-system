import { IsInt, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  userId!: number;

  @IsString()
  date!: string;

  @IsString()
  time!: string;

  @IsString()
  phone!: string;
}
