import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { AuthEntity } from './auth.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async login(credentials: LoginDto): Promise<AuthEntity> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: credentials.username }, { email: credentials.email }],
      },
    });

    if (!user)
      throw new NotFoundException('Invalid credentials, check and try again');

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials, check and try again',
      );
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
      username: user.username,
      email: user.email,
    };
  }
}
