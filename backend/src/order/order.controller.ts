import { Controller, Post, Get, Body } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place')
  placeOrder(@Body() body: any) {
    return this.orderService.placeOrder(body);
  }

  @Get('list')
  listOrders() {
    return this.orderService.listOrders();
  }

  @Post('userorders')
  userOrders(@Body() body: any) {
    return this.orderService.userOrders(body.userId);
  }

  @Post('status')
  updateStatus(@Body() body: any) {
    return this.orderService.updateStatus(body.orderId, body.status);
  }

  @Post('verify')
  verifyOrder(@Body() body: any) {
    return this.orderService.verifyOrder(body.orderId, body.success);
  }
}
