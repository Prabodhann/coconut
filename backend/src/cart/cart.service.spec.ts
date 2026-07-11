import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { User } from '../user/schemas/user.schema';

describe('CartService', () => {
  let service: CartService;
  let userModel: { findById: jest.Mock; findByIdAndUpdate: jest.Mock };

  beforeEach(async () => {
    userModel = { findById: jest.fn(), findByIdAndUpdate: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService, { provide: getModelToken(User.name), useValue: userModel }],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  describe('addToCart', () => {
    it('increments the item count and saves', async () => {
      userModel.findById.mockResolvedValue({ cartData: { item1: 1 } });
      userModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.addToCart('u1', 'item1');

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('u1', {
        cartData: { item1: 2 },
      });
      expect(result).toEqual({ success: true, message: 'Added To Cart' });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.addToCart('missing', 'item1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromCart', () => {
    it('decrements the item count and saves', async () => {
      userModel.findById.mockResolvedValue({ cartData: { item1: 2 } });
      userModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.removeFromCart('u1', 'item1');

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('u1', {
        cartData: { item1: 1 },
      });
      expect(result).toEqual({ success: true, message: 'Removed From Cart' });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.removeFromCart('missing', 'item1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getCart', () => {
    it('returns the cart data', async () => {
      userModel.findById.mockResolvedValue({ cartData: { item1: 1 } });

      const result = await service.getCart('u1');

      expect(result).toEqual({ success: true, cartData: { item1: 1 } });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.getCart('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
