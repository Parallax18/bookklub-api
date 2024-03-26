// auth.middleware.ts
import { NestMiddleware, Injectable } from '@nestjs/common';
import { JwtStrategy } from './jwt/jwt.strategy';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async use(socket: any, next: () => void) {
    const token = socket.handshake?.query?.token as string;

    if (!token) {
      console.error('No authentication token provided.');
      // Handle missing token (disconnect the socket, etc.)
      socket.disconnect();
      return;
    }

    try {
      // Use JwtStrategy to validate the token and obtain user information
      const user = await this.jwtStrategy.validate({ userId: token });

      // Attach user information to the socket
      socket.user = user;

      next();
    } catch (error) {
      console.error('Authentication failed:', error.message);
      // Handle authentication failure (disconnect the socket, etc.)
      socket.disconnect();
    }
  }
}
