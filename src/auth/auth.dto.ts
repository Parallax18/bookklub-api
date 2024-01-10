import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';

class OneOfFields {
  // Validation logic
  validate(value: any, args: string[]): boolean {
    const fieldsCount = args.reduce(
      (count, field) => (value[field] ? count + 1 : count),
      0,
    );
    return fieldsCount === 1;
  }
}

export class LoginDto {
  @IsEmail()
  @ApiProperty({ required: false })
  @IsOptional()
  @Validate(OneOfFields, ['email', 'username'], {
    message: 'Either email or username should be provided, but not both',
  })
  email: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  @Validate(OneOfFields, ['email', 'username'], {
    message: 'Either email or username should be provided, but not both',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;
}
