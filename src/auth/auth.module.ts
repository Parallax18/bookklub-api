import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { MailerHelper } from 'src/helpers/mailer.helper';
import { OTPHelper } from 'src/helpers/otp.helper';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2d' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    OTPHelper,
    MailerHelper,
    AuthService,
    PrismaService,
    UsersService,
    JwtStrategy,
  ],
})
export class AuthModule {}
