import { Controller, Post, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartActionDto, GetCartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() body: CartActionDto) {
    return this.cartService.addToCart(body.userId, body.itemId);
  }

  @Post('remove')
  removeFromCart(@Body() body: CartActionDto) {
    return this.cartService.removeFromCart(body.userId, body.itemId);
  }

  @Post('get')
  getCart(@Body() body: GetCartDto) {
    return this.cartService.getCart(body.userId);
  }
}
