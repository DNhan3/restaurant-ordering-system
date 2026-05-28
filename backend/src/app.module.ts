import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FoodsModule } from './modules/foods.module.js';
import { UsersModule } from './modules/users.module.js';
import { CartItemsModule } from './modules/cart-items.module.js';
import { BookingsModule } from './modules/bookings.module.js';
import { BillDetailsModule } from './modules/bill-details.module.js';
import { BillStatusModule } from './modules/bill-status.module.js';
import { AdminModule } from './modules/admin.module.js';
import { AuthModule } from './modules/auth.module.js';
import { CartModule } from './modules/cart.module.js';
import { BillingModule } from './modules/billing.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'wad_restaurant'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    FoodsModule,
    UsersModule,
    CartItemsModule,
    BookingsModule,
    BillDetailsModule,
    BillStatusModule,
    AdminModule,
    AuthModule,
    CartModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
