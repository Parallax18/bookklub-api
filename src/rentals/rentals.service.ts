import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRentalDto } from './rental.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class RentalsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookService: BooksService,
    private readonly userService: UsersService,
  ) {}
  async request(rentalData: CreateRentalDto) {
    const book = await this.bookService.findOne(rentalData.book);
    const renter = await this.userService.findOne(rentalData.renter);

    const rental = await this.prismaService.rental.create({
      data: {
        ...rentalData,
        book: { connect: { id: book.id } },
        renter: { connect: { id: renter.id } },
      },
    });

    await this.userService.notify(renter.id, {
      type: NotificationType.RENTREQUEST,
      info: {
        username: renter.username,
        duration: rental.durationOfRental,
        booktitle: book.title,
        rentalId: rental.id,
      },
    });
  }

  async accept(id: string) {
    const rental = await this.findOne(id);
    const book = await this.bookService.findOne(rental.bookId);

    // if (user.id !== book.ownerId) {
    //   throw new ForbiddenException("You're not the owner of the book");
    // }

    const returnDate = new Date(
      new Date().getTime() + rental.durationOfRental * 24 * 60 * 60 * 1000,
    );

    await this.userService.notify(rental.renterId, {
      type: NotificationType.ACCEPTEDREQUEST,
      info: {
        booktitle: book.title,
      },
    });

    return await this.prismaService.rental.update({
      where: { id },
      data: { returnDate, isAccepted: true },
    });
  }

  findAll() {
    return `This action returns all rentals`;
  }

  async findOne(id: string) {
    const rental = await this.prismaService.rental.findUnique({
      where: { id },
    });
    if (!rental) throw new NotFoundException('Rental not found');
    return rental;
  }

  // update(id: number, updateRentalDto: UpdateRentalDto) {
  //   return `This action updates a #${id} rental`;
  // }

  remove(id: number) {
    return `This action removes a #${id} rental`;
  }
}
