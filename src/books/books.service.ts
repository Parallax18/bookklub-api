import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}
  async create(book: CreateBookDto) {
    const owner = await this.userService.findOne(book.owner);

    return this.prismaService.book.create({
      data: { ...book, owner: { connect: { id: owner.id } } },
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
      ...(params && {
        where: {
          title: { contains: params.title, mode: 'insensitive' },
          author: { contains: params.author, mode: 'insensitive' },
          genre: { contains: params.genre, mode: 'insensitive' },
          state: { contains: params.state, mode: 'insensitive' },
          country: { contains: params.country, mode: 'insensitive' },
        },
      }),
      include: {
        rental: true,
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
      },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }
}
