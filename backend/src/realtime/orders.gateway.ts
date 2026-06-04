import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Socket, Server } from 'socket.io';
import { JwtTokenService } from '../auth/jwt-token.service.js';
import { RealtimeEventsService } from './realtime-events.service.js';
import type { AuthUser } from '../auth/auth.types.js';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: false,
  },
})

export class OrdersGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly realtimeEvents: RealtimeEventsService,
  ) {}

  afterInit(server: Server) {
    this.realtimeEvents.setServer(server);
  }

  @SubscribeMessage('orders:subscribe')
  subscribeToOrders(
    @MessageBody() body: { scope?: string; userId?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.getUser(client);

    if (user.role === 'admin') {
      client.join('orders:admin');
      return { subscribed: true, room: 'orders:admin' };
    }

    if (user.role === 'shipper') {
      client.join('orders:shippers');
      client.join(`orders:shipper:${user.sub}`);
      return { subscribed: true, room: 'orders:shippers' };
    }

    const requestedUserId = Number(body?.userId ?? user.sub);
    if (requestedUserId !== user.sub) {
      return { subscribed: false, reason: 'forbidden' };
    }

    client.join(`orders:user:${user.sub}`);
    return { subscribed: true, room: `orders:user:${user.sub}` };
  }

  private getUser(client: Socket): AuthUser {
    const token = String(client.handshake.auth?.token || '');
    return this.jwtTokenService.verify(token);
  }
}
