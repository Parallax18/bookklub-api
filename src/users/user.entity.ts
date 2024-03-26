import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty({ default: false })
  is_email_verified: boolean;
  @ApiProperty({ default: false })
  is_phone_verified: boolean;
  @ApiProperty({ default: false })
  is_active: boolean;
  @Exclude()
  password: string;
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

export class GenericResponseEntity {
  @ApiProperty()
  message: string;
  @ApiProperty()
  status: number;
}
