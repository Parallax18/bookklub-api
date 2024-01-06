import { Injectable } from '@nestjs/common';
import { SignupDto } from './auth.dto';

@Injectable()
export class AuthService {
  async signup(credentials: SignupDto) {
    return credentials;
  }

  async login() {}
}
