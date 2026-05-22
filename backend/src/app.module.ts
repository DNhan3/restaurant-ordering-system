import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { CartModule } from './cart/cart.module';
import { CommonModule } from './common/common.module';
import { FoodsModule } from './foods/foods.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    FoodsModule,
    CartModule,
    OrdersModule,
    BookingsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
