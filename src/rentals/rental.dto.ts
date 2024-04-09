import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRentalDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  durationOfRental: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  bookId: string;
}
export class UpdateRentalDto extends PartialType(CreateRentalDto) {}
