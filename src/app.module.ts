import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { RentalsModule } from './rentals/rentals.module';

import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { JwtStrategy } from './auth/jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    BooksModule,
    RentalsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, ChatGateway],
})
export class AppModule {}
