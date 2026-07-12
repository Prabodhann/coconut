import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

describe('CartController', () => {
  let controller: CartController;
  let service: {
    addToCart: jest.Mock;
    removeFromCart: jest.Mock;
    getCart: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      getCart: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{ provide: CartService, useValue: service }],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('addToCart delegates to CartService.addToCart', () => {
    const expected = { success: true, message: 'Added To Cart' };
    service.addToCart.mockReturnValue(expected);

    const result = controller.addToCart({ userId: 'u1', itemId: 'item1' });

    expect(service.addToCart).toHaveBeenCalledWith('u1', 'item1');
    expect(result).toBe(expected);
  });

  it('removeFromCart delegates to CartService.removeFromCart', () => {
    const expected = { success: true, message: 'Removed From Cart' };
    service.removeFromCart.mockReturnValue(expected);

    const result = controller.removeFromCart({ userId: 'u1', itemId: 'item1' });

    expect(service.removeFromCart).toHaveBeenCalledWith('u1', 'item1');
    expect(result).toBe(expected);
  });

  it('getCart delegates to CartService.getCart', () => {
    const expected = { success: true, cartData: {} };
    service.getCart.mockReturnValue(expected);

    const result = controller.getCart({ userId: 'u1' });

    expect(service.getCart).toHaveBeenCalledWith('u1');
    expect(result).toBe(expected);
  });
});
