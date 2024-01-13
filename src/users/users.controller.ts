import {
  Body,
  Controller,
  Get,
  Param,
  ValidationPipe,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './user.dto';
import { Prisma } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Get(':id/notifications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllUserNotications(@Param('id') id: string) {
    return await this.usersService.findAllUserNotications({ id });
  }

  @Post(':id/notify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async notify(
    @Param('id') id: string,
    @Body(ValidationPipe) notification: Prisma.NotificationCreateInput,
  ) {
    return await this.usersService.notify({ id, notification });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) data: UpdateUserDto,
  ) {
    return await this.usersService.update(id, data);
  }
}
