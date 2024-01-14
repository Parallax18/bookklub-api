import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRentalDto } from './rental.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';
import { NotificationType } from '@prisma/client';
import * as cron from 'node-cron';

@Injectable()
export class RentalsService {
  private readonly logger = new Logger(RentalsService.name);

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

    await this.userService.notify(book.owner.id, {
      type: NotificationType.RENTREQUEST,
      info: {
        renter: renter.username,
        duration: rental.durationOfRental,
        booktitle: book.title,
        rentalId: rental.id,
      },
    });

    return rental;
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
    returnDate.setHours(11, 59, 0, 0);

    await this.userService.notify(rental.renterId, {
      type: NotificationType.ACCEPTEDREQUEST,
      info: {
        bookowner: book.owner.username,
        booktitle: book.title,
      },
    });

    return await this.prismaService.rental.update({
      where: { id },
      data: { returnDate, isAccepted: true },
    });
  }

  async reject(id: string) {
    const rental = await this.findOne(id);
    const book = await this.bookService.findOne(rental.bookId);
    await this.userService.notify(rental.renterId, {
      type: NotificationType.REJECTEDREQUEST,
      info: {
        booktitle: book.title,
        bookowner: book.owner.username,
      },
    });

    return await this.delete(rental.id);
  }

  async findAll() {
    return await this.prismaService.rental.findMany();
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

  delete(id: string) {
    return this.prismaService.rental.delete({ where: { id } });
  }

  async findAndUpdateOverdueRentals() {
    const overdueRentals = await this.prismaService.rental.findMany({
      where: { returnDate: { lt: new Date() } },
    });

    if (overdueRentals.length === 0) return [];

    const updatedRentals = await this.prismaService.rental.updateMany({
      where: { returnDate: { lt: new Date() } },
      data: {
        isOverdue: true,
      },
    });

    return updatedRentals;
  }

  runCronJob(): void {
    cron.schedule('59 23 * * *', async () => {
      try {
        this.logger.log('Running cron job');
        this.findAndUpdateOverdueRentals();
      } catch (err) {
        this.logger.error('Error in cron job:', err);
      }
    });
  }
}
