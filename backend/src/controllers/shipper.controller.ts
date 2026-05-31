import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ShipperService } from '../services/shipper.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import type { AuthUser } from '../auth/auth.types.js';

@Controller('shipper')
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) {}

  @Get('available-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shipper')
  availableOrders() {
    return this.shipperService.availableOrders();
  }

  @Get('my-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shipper')
  myOrder(@Req() request: Request & { user: AuthUser }) {
    return this.shipperService.myOrder(request.user.sub);
  }

  @Post('accept/:billId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shipper')
  accept(
    @Param('billId', ParseIntPipe) billId: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.shipperService.accept(billId, request.user.sub);
  }

  @Post('deny/:billId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shipper')
  deny(
    @Param('billId', ParseIntPipe) billId: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.shipperService.deny(billId, request.user.sub);
  }

  @Post('pickup/:billId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shipper')
  pickup(
    @Param('billId', ParseIntPipe) billId: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.shipperService.pickup(billId, request.user.sub);
  }

  @Post('delivered/:billId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shipper')
  delivered(
    @Param('billId', ParseIntPipe) billId: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.shipperService.delivered(billId, request.user.sub);
  }
}
