import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AuthService } from '../auth/auth.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: 'http://localhost:3000',
  },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  private readonly userSockets: Map<string, Socket> = new Map();

  async handleConnection(client: Socket): Promise<any> {
    const id = client.handshake.auth?.id || client.handshake.headers?.id;
    console.log(id);
    this.userSockets.set(id, client);
  }

  handleDisconnect(client: Socket): any {
    for (const [userId, socket] of this.userSockets.entries()) {
      if (socket === client) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  private getUserSocket(userId: string): Socket | undefined {
    return this.userSockets.get(userId);
  }

  @SubscribeMessage('update-order-status')
  handleStatus(@MessageBody() updateOrderStatusDto: UpdateOrderStatusDto): void {
    const { userId } = updateOrderStatusDto;
    console.log('update-order', userId);
    const userSocket = this.getUserSocket(userId);
    console.log('user socket', userSocket.id);
    if (userSocket) {
      userSocket.emit('update-order-status', updateOrderStatusDto);
    }
  }
}
