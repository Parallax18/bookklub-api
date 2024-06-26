import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

// import * as fs from 'fs';
// import { Readable } from 'stream';

// const filePath = '/Users/adnankayode/Downloads/Affiliate.jpg'; // Replace with your file path
// const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

// console.log(fileContent);

@Injectable()
export class BooksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}
  async create(book: CreateBookDto & { owner: string }) {
    return this.prismaService.book.create({
      data: { ...book, owner: { connect: { id: book.owner } } },
    });
  }

  async findAll(params?: {
    title: string;
    author: string;
    genre: string;
    state: string;
    country: string;
  }) {
    const books = this.prismaService.book.findMany({
      where: {
        OR: [
          { rentals: { every: { isAccepted: null } } },
          { rentals: { every: { id: undefined } } },
        ],
        ...(params && {
          title: { contains: params.title, mode: 'insensitive' },
          author: { contains: params.author, mode: 'insensitive' },
          genre: { contains: params.genre, mode: 'insensitive' },
          state: { contains: params.state, mode: 'insensitive' },
          country: { contains: params.country, mode: 'insensitive' },
        }),
      },
      include: {
        rentals: true,
        owner: true,
      },
    });

    return books;
  }

  async findOne(id: string) {
    const book = this.prismaService.book.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            createdAt: true,
            email: true,
            username: true,
            mobile: true,
            state: true,
            country: true,
            address: true,
          },
        },
        rentals: true,
      },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }
}
