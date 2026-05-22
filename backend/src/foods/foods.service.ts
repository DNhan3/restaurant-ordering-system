import { Injectable } from '@nestjs/common';

@Injectable()
export class FoodsService {
  findAll() {
    return {
      message: 'Food menu endpoint ready',
      items: [],
    };
  }

  findOne(id: string) {
    return {
      message: 'Food detail endpoint ready',
      id,
    };
  }
}
