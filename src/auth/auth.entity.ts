import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/user.entity';

export class AuthEntity {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  id: string;
  @ApiProperty({ default: false })
  is_email_verified: boolean;
}

export class LoginEntity extends UserEntity {
  @ApiProperty()
  accessToken: string;
}

export class SignUpEntity extends UserEntity {
  @ApiProperty()
  authToken: string;
}

export class JWTResolvedEntity {
  userId: string;
  iat: string;
  exp: string;
}

export class OTPEntity {
  @ApiProperty()
  token: string;
}

export class GenericResponseEntity {
  @ApiProperty()
  message: string;
}
