import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BooksController],
  providers: [
    JwtService,
    BooksService,
    UsersService,
    FirebaseService,
    PrismaService,
  ],
})
export class BooksModule {}
