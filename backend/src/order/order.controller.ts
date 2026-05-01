import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Headers,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Request } from 'express';
import { OrderService } from './order.service';
import {
  PlaceOrderDto,
  UserOrdersDto,
  UpdateStatusDto,
  VerifyOrderDto,
} from './dto/order.dto';
import { AdminGuard } from '../auth/admin.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place')
  placeOrder(@Body() body: PlaceOrderDto) {
    return this.orderService.placeOrder(body);
  }

  @Get('list')
  @UseGuards(AdminGuard)
  listOrders() {
    return this.orderService.listOrders();
  }

  @Post('userorders')
  userOrders(@Body() body: UserOrdersDto) {
    return this.orderService.userOrders(body.userId);
  }

  @Post('status')
  @UseGuards(AdminGuard)
  updateStatus(@Body() body: UpdateStatusDto) {
    return this.orderService.updateStatus(body.orderId, body.status);
  }

  @Post('verify')
  verifyOrder(@Body() body: VerifyOrderDto) {
    return this.orderService.verifyOrder(body.orderId, body.success);
  }

  @Post('webhook')
  @SkipThrottle()
  stripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.orderService.handleStripeWebhook(
      req.body as Buffer,
      signature,
    );
  }
}
