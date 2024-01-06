import { PartialType } from '@nestjs/mapped-types';
import { IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsMobilePhone()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  // @IsStrongPassword({ minLength: 5 })
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
