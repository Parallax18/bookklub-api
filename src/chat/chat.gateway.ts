import { UseGuards } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JWTResolvedEntity } from 'src/auth/auth.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
    // credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  @WebSocketServer()
  server: Server;

  // handleDirectMessaging(
  //   senderId: string,
  //   recipientId: string,
  //   message: string,
  // ) {
  //   this.server.to(recipientId).emit('direct-message', { senderId, message });
  // }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization;
    if (token) {
      const jwtResponse = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as unknown as JWTResolvedEntity;
      const user = await this.jwtStrategy.validate({
        userId: jwtResponse.userId,
      });

      if (user) {
        console.log('Connected Me', client.id, user.username);
        // client.username = user.username;
        client.broadcast.emit('user-connected', {
          msg: user,
          from: client.id,
        });
      }
    }
    // });
  }

  handleDisconnect() {
    console.log('Disconnected');
  }

  @SubscribeMessage('direct-message')
  async handleDirectMessage(
    @MessageBody() { recipient, message }: any,
    @ConnectedSocket() client: Socket,
  ) {
    // const { recipient, message } = data;
    // console.log({ recipient, message });
    client
      .to(recipient)
      .emit('direct-message', { senderId: client.id, message: message });
    // console.log(recipient, 'After');
  }

  @SubscribeMessage('test-fire')
  testfire(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log(data, client.id);
  }
}
