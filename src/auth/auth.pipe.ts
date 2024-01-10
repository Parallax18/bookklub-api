import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from './auth.dto';

@Injectable()
export class LoginDtoValidationPipe implements PipeTransform<any> {
  async transform(value: any): Promise<LoginDto> {
    const loginDto = plainToClass(LoginDto, value);
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    if (
      (loginDto.email && loginDto.username) ||
      (!loginDto.email && !loginDto.username)
    ) {
      throw new BadRequestException(
        'Either email or username should be provided, but not both',
      );
    }

    return loginDto;
  }
}
