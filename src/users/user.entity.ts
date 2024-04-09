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
  mobile: string;
  @ApiProperty()
  country: string;
  @ApiProperty({ default: false })
  is_email_verified: boolean;

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
