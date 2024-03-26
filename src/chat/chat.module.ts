import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    JwtService,
    ChatGateway,
    JwtStrategy,
    UsersService,
    PrismaService,
  ],
})
export class ChatModule {}
