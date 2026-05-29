import { IsInt, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  book_name!: string;

  @IsInt()
  book_phone!: number;

  @IsInt()
  book_people!: number;

  @IsInt()
  book_tables!: number;

  @IsInt()
  user_id!: number | null;

  @IsString()
  book_when!: string;

  @IsString()
  book_note!: string;
}
