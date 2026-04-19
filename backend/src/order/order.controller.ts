import { Controller, Post, Get, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  PlaceOrderDto,
  UserOrdersDto,
  UpdateStatusDto,
  VerifyOrderDto,
} from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place')
  placeOrder(@Body() body: PlaceOrderDto) {
    return this.orderService.placeOrder(body);
  }

  @Get('list')
  listOrders() {
    return this.orderService.listOrders();
  }

  @Post('userorders')
  userOrders(@Body() body: UserOrdersDto) {
    return this.orderService.userOrders(body.userId);
  }

  @Post('status')
  updateStatus(@Body() body: UpdateStatusDto) {
    return this.orderService.updateStatus(body.orderId, body.status);
  }

  @Post('verify')
  verifyOrder(@Body() body: VerifyOrderDto) {
    return this.orderService.verifyOrder(body.orderId, body.success);
  }
}
