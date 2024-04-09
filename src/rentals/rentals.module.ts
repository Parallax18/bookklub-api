import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RentalsController],
  providers: [
    JwtService,
    RentalsService,
    PrismaService,
    BooksService,
    UsersService,
  ],
})
export class RentalsModule {}
