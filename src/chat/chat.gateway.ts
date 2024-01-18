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

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  socket: Socket;
  @WebSocketServer()
  server: Server;

  handleDirectMessaging(
    senderId: string,
    recipientId: string,
    message: string,
  ) {
    this.server.to(recipientId).emit('direct-message', { senderId, message });
  }

  handleConnection(client: Socket) {
    // const userId = getUserIdFromSomehow();
    // client.join(userId);
    console.log(client.id);
    // client.emit('greeting', 'People');
  }

  handleDisconnect() {
    console.log('Disconnected');
  }

  // initialization.
  @SubscribeMessage('sayhello')
  handleMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    console.log({ body });
    client.emit('respond', `New chat initiated between USER and ${client.id}`);
  }
}
