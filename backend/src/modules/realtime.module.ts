import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth.module.js';
import { OrdersGateway } from '../realtime/orders.gateway.js';
import { RealtimeEventsService } from '../realtime/realtime-events.service.js';

@Global()
@Module({
  imports: [AuthModule],
  providers: [OrdersGateway, RealtimeEventsService],
  exports: [RealtimeEventsService],
})
export class RealtimeModule {}
