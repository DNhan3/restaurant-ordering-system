import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  checkout(body: unknown) {
    return {
      message: 'Checkout endpoint ready',
      data: body,
    };
  }

  findCustomerOrders() {
    return {
      message: 'Customer order history endpoint ready',
      items: [],
    };
  }

  findOne(id: string) {
    return {
      message: 'Order detail endpoint ready',
      id,
    };
  }
}
