import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ConfirmOtpDto,
  GenerateAndSendOtpDTO,
  LoginDto,
  OtpDto,
  ResetPasswordDto,
} from './auth.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity, OTPEntity, SignUpEntity } from './auth.entity';
import { CreateUserDto } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDtoValidationPipe } from './auth.pipe';
import { UserEntity } from 'src/users/user.entity';
import { EmailType } from 'src/helpers/interfaces/mailer.interfaces';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiOkResponse({ type: SignUpEntity })
  async create(@Body(ValidationPipe) user: CreateUserDto) {
    return await this.usersService.create(user);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(
    @Body(new LoginDtoValidationPipe())
    credentials: LoginDto,
  ) {
    return this.authService.login(credentials);
  }

  @Post('otp')
  @ApiOkResponse({ type: OTPEntity })
  async generateAndSendOtp(@Body() data: GenerateAndSendOtpDTO) {
    return this.authService.generateAndSendOtp(data, EmailType.OTP);
  }

  @Post('otp/confirm')
  @ApiOkResponse({ type: UserEntity })
  async confirmOtp(@Body() data: ConfirmOtpDto): Promise<OTPEntity> {
    return this.authService.confirmOtp(data);
  }

  @Post('forgot-password')
  @ApiOkResponse({ type: OTPEntity })
  async forgotPassword(@Body() data: OtpDto) {
    return this.authService.generateAndSendOtp(data, EmailType.RESET_PASSWORD);
  }

  @Post('reset-password')
  @ApiOkResponse({ type: UserEntity })
  async resetPassword(@Body() data: ResetPasswordDto) {
    return await this.authService.resetPassword(data);
  }
}
