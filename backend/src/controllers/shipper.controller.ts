import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ShipperService } from '../services/shipper.service.js';

@Controller('shipper')
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.shipperService.login(body.email, body.password);
  }

  @Get('available-orders')
  availableOrders() {
    return this.shipperService.availableOrders();
  }

  @Get('my-order/:shipperId')
  myOrder(@Param('shipperId', ParseIntPipe) shipperId: number) {
    return this.shipperService.myOrder(shipperId);
  }

  @Post('accept/:billId')
  accept(
    @Param('billId', ParseIntPipe) billId: number,
    @Body('shipperId', ParseIntPipe) shipperId: number,
  ) {
    return this.shipperService.accept(billId, shipperId);
  }

  @Post('deny/:billId')
  deny(
    @Param('billId', ParseIntPipe) billId: number,
    @Body('shipperId', ParseIntPipe) shipperId: number,
  ) {
    return this.shipperService.deny(billId, shipperId);
  }

  @Post('pickup/:billId')
  pickup(
    @Param('billId', ParseIntPipe) billId: number,
    @Body('shipperId', ParseIntPipe) shipperId: number,
  ) {
    return this.shipperService.pickup(billId, shipperId);
  }

  @Post('delivered/:billId')
  delivered(
    @Param('billId', ParseIntPipe) billId: number,
    @Body('shipperId', ParseIntPipe) shipperId: number,
  ) {
    return this.shipperService.delivered(billId, shipperId);
  }
}
