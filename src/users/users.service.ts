import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<UserModel[]> {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string): Promise<UserModel> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(user: CreateUserDto): Promise<UserModel> {
    const hashedPassword = await bcrypt.hash(
      user.password,
      Number(process.env.HASH_ROUNDS),
    );

    user.password = hashedPassword;
    return this.prismaService.user.create({ data: user });
  }

  async update(id: string, data: UpdateUserDto) {
    if (data.password) {
      data.password = await bcrypt.hash(
        data.password,
        Number(process.env.HASH_ROUNDS),
      );
    }
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async notify(userId: string, data) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        notifications: { create: { type: data.type, info: data?.info } },
      },
    });
  }

  async findAllUserNotications({ id }: { id: string }) {
    return this.prismaService.user
      .findUnique({ where: { id } })
      .notifications();
  }
}
