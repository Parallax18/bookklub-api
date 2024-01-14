import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, UsersService, FirebaseService, PrismaService],
})
export class BooksModule {}
