import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as UserModel } from '@prisma/client';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<UserModel[]> {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string): Promise<UserModel> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: CreateUserDto): Promise<UserModel> {
    const { password, email } = this.jwtService.decode(data.token);
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email }, { mobile: data.mobile }],
      },
    });
    if (existingUser) {
      if (existingUser.username === data.username)
        throw new ConflictException('Username taken', '409');
      if (existingUser.email === email)
        throw new ConflictException('Email taken', '409');
      if (existingUser.mobile === data.mobile)
        throw new ConflictException('Phone number taken', '409');
    }
    delete data.token;
    return this.prismaService.user.create({
      data: { ...data, is_email_verified: true, password, email },
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
