import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  getCart() {
    return {
      message: 'Shopping cart endpoint ready',
      items: [],
    };
  }

  addItem(body: unknown) {
    return {
      message: 'Add cart item endpoint ready',
      data: body,
    };
  }

  updateItem(id: string, body: unknown) {
    return {
      message: 'Update cart item endpoint ready',
      id,
      data: body,
    };
  }

  removeItem(id: string) {
    return {
      message: 'Remove cart item endpoint ready',
      id,
    };
  }
}
