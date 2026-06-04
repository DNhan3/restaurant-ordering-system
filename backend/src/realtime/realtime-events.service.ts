import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';

type OrderEventPayload = {
  type: 'created' | 'updated' | 'deleted';
  order: any;
};

@Injectable()
export class RealtimeEventsService {
  private server: Server | null = null;

  setServer(server: Server) {
    this.server = server;
  }

  emitOrderChanged(payload: OrderEventPayload) {
    if (!this.server || !payload.order) {
      return;
    }

    this.server.to('orders:admin').emit('order:changed', payload);
    this.server.to('orders:shippers').emit('order:changed', payload);

    if (payload.order.user_id) {
      this.server
        .to(`orders:user:${payload.order.user_id}`)
        .emit('order:changed', payload);
    }

    if (payload.order.shipper_id) {
      this.server
        .to(`orders:shipper:${payload.order.shipper_id}`)
        .emit('order:changed', payload);
    }
  }
}
