import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ConfirmOtpDto,
  GenerateAndSendOtpDTO,
  LoginDto,
  OtpDto,
  ResetPasswordDto,
} from './auth.dto';
import { AuthEntity } from './auth.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailType } from 'src/helpers/interfaces/mailer.interfaces';
import { MailerHelper } from 'src/helpers/mailer.helper';
import { OTPHelper } from 'src/helpers/otp.helper';

export const resetPasswordUrl = '';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailer: MailerHelper,
    private readonly otpHelper: OTPHelper,
  ) {}
  async login(credentials: LoginDto): Promise<AuthEntity> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: credentials.username }, { email: credentials.email }],
      },
    });

    if (!user)
      throw new NotFoundException('Invalid credentials, check and try again');

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials, check and try again',
      );
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
      username: user.username,
      email: user.email,
      id: user.id,
      is_email_verified: user.is_email_verified,
    };
  }

  async confirmOtp({ otp, token }: ConfirmOtpDto) {
    const decoded = this.jwtService.decode(token);
    if (decoded.otp === otp) {
      const newToken = this.jwtService.sign(
        {
          isVerified: true,
          email: decoded.email,
        },
        { expiresIn: '1h' },
      );

      return { token: newToken };
    } else {
      throw new BadRequestException('Check OTP and try again');
    }
  }

  private async generateOtpAndToken(data: GenerateAndSendOtpDTO | OtpDto) {
    const OTP = this.otpHelper.generateOtp();

    const token = this.jwtService.sign(
      {
        otp: OTP,
        email: data.email,
      },
      { expiresIn: '1h' },
    );

    return { token, OTP };
  }

  async generateAndSendOtp(
    data: GenerateAndSendOtpDTO | OtpDto,
    type: EmailType,
  ) {
    const { OTP, token } = await this.generateOtpAndToken(data);

    await this.mailer.sendMail({
      type,
      options: {
        to: data.email,
        content: {
          OTP,
          name: data.email,
        },
      },
    });

    return { token };
  }

  async forgotPassword(data: OtpDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (!existingUser) throw new NotFoundException('User does not exist');
    if (!existingUser.is_email_verified)
      throw new ForbiddenException('User email is not verified');
    return await this.generateAndSendOtp(
      { email: data.email },
      EmailType.RESET_PASSWORD,
    );
  }

  async resetPassword(data: ResetPasswordDto) {
    const decoded = this.jwtService.decode(data.token);
    const user = await this.prismaService.user.findUnique({
      where: { email: decoded.email },
    });
    if (!user) throw new NotFoundException('User not found');

    if (data.otp !== decoded.otp) throw new BadRequestException('Invalid OTP!');

    const hashedNewPassword = await bcrypt.hash(
      data.password,
      Number(process.env.HASH_ROUNDS),
    );

    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    delete updatedUser.password;
    return updatedUser;
  }
}
