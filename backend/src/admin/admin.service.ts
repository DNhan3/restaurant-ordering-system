import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  getDashboard() {
    return {
      message: 'Admin dashboard endpoint ready',
    };
  }

  getOrders() {
    return {
      message: 'Manage orders endpoint ready',
      items: [],
    };
  }

  updateOrder(id: string, body: unknown) {
    return {
      message: 'Update order endpoint ready',
      id,
      data: body,
    };
  }

  getFoods() {
    return {
      message: 'Manage food menu endpoint ready',
      items: [],
    };
  }

  createFood(body: unknown) {
    return {
      message: 'Create food endpoint ready',
      data: body,
    };
  }

  updateFood(id: string, body: unknown) {
    return {
      message: 'Update food endpoint ready',
      id,
      data: body,
    };
  }
}
