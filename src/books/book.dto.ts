import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  author: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  coverImg: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  genre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  state: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  country: string;
}

export class RequestBookDto {
  @IsString()
  @ApiProperty()
  renter: string;

  @IsNumber()
  @ApiProperty({ required: false })
  @IsOptional()
  durationOfRental: number;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
