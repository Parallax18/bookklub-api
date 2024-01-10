import {
  Body,
  Controller,
  Get,
  Param,
  ValidationPipe,
  Post,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './user.dto';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Get(':id/notifications')
  async findAllUserNotications(@Param('id') id: string) {
    return await this.usersService.findAllUserNotications({ id });
  }

  @Post(':id/notify')
  async notify(
    @Param('id') id: string,
    @Body(ValidationPipe) notification: Prisma.NotificationCreateInput,
  ) {
    return await this.usersService.notify({ id, notification });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) data: UpdateUserDto,
  ) {
    return await this.usersService.update(id, data);
  }
}
