import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './user.entity';

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

  async create(
    data: CreateUserDto,
  ): Promise<UserEntity & { authToken: string }> {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email: data.email },
          { mobile: data.mobile },
        ],
      },
    });
    if (existingUser) {
      if (existingUser.username === data.username)
        throw new ConflictException('Username taken', '409');
      if (existingUser.email === data.email)
        throw new ConflictException('Email taken', '409');
      if (existingUser.mobile === data.mobile)
        throw new ConflictException('Phone number taken', '409');
    }

    const decoded = this.jwtService.decode(data.token);

    if (!decoded.email && !decoded.isVerified)
      throw new ForbiddenException('Email is not verified');

    const hashedPassword = await bcrypt.hash(
      data.password,
      Number(process.env.HASH_ROUNDS),
    );
    delete data.token;
    const newUser = await this.prismaService.user.create({
      data: { ...data, password: hashedPassword, is_email_verified: true },
    });
    return {
      ...newUser,
      authToken: this.jwtService.sign({ userId: newUser.id }),
    };
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
