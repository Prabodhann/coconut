import { Controller, Post, Body } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() body: any) {
    return this.cartService.addToCart(body.userId, body.itemId);
  }

  @Post('remove')
  removeFromCart(@Body() body: any) {
    return this.cartService.removeFromCart(body.userId, body.itemId);
  }

  @Post('get')
  getCart(@Body() body: any) {
    return this.cartService.getCart(body.userId);
  }
}
