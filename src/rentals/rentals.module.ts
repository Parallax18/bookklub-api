import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RentalsController],
  providers: [
    JwtService,
    RentalsService,
    PrismaService,
    FirebaseService,
    BooksService,
    UsersService,
  ],
})
export class RentalsModule {}
