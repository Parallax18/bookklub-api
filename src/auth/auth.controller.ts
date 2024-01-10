import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './auth.entity';
import { CreateUserDto } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async create(@Body(ValidationPipe) user: CreateUserDto) {
    return await this.usersService.create(user);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(@Body(ValidationPipe) credentials: LoginDto) {
    return this.authService.login(credentials);
  }
}
