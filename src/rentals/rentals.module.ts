import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [RentalsController],
  providers: [RentalsService, PrismaService, BooksService, UsersService],
})
export class RentalsModule {}
