import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import Stripe from 'stripe';
import { OrderService } from './order.service';
import { Order } from './schemas/order.schema';
import { User } from '../user/schemas/user.schema';

const mockSessionsCreate = jest.fn();
const mockConstructEvent = jest.fn();
// order.service.ts does `import Stripe from 'stripe'` (default import); under this
// project's tsconfig (no esModuleInterop) that compiles to `new stripe_1.default(...)`,
// so the mock module must expose a `default` key, not a bare constructor.
jest.mock('stripe', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      checkout: { sessions: { create: mockSessionsCreate } },
      webhooks: { constructEvent: mockConstructEvent },
    })),
  };
});

describe('OrderService', () => {
  let service: OrderService;
  let orderModelCtor: jest.Mock;
  let orderModel: {
    find: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
  };
  let userModel: { findByIdAndUpdate: jest.Mock };
  let saveMock: jest.Mock;

  const placeOrderDto = {
    userId: 'u1',
    items: [{ itemId: 'i1', name: 'Curry', price: 100, quantity: 2 }],
    amount: 205,
    address: {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      street: 'St',
      city: 'City',
      state: 'State',
      zipcode: '000000',
      country: 'IN',
      phone: '0000000000',
    },
  };

  beforeEach(async () => {
    saveMock = jest.fn().mockResolvedValue(undefined);
    orderModelCtor = jest.fn().mockImplementation((doc: Record<string, unknown>) => ({
      ...doc,
      _id: { toString: () => 'order1' },
      save: saveMock,
    })) as unknown as jest.Mock;
    orderModel = Object.assign(orderModelCtor, {
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    });
    userModel = { findByIdAndUpdate: jest.fn() };
    mockSessionsCreate.mockReset();
    mockConstructEvent.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getModelToken(Order.name), useValue: orderModel },
        { provide: getModelToken(User.name), useValue: userModel },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-value'),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  describe('placeOrder', () => {
    it('creates a Stripe session, saves the order, and clears the cart', async () => {
      mockSessionsCreate.mockResolvedValue({ url: 'https://stripe/session' });
      userModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.placeOrder(placeOrderDto);

      expect(mockSessionsCreate).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('u1', { cartData: {} });
      expect(result).toEqual({ success: true, session_url: 'https://stripe/session' });
    });

    it('throws ServiceUnavailableException when Stripe is unavailable', async () => {
      mockSessionsCreate.mockRejectedValue(new Error('stripe down'));

      await expect(service.placeOrder(placeOrderDto)).rejects.toThrow(
        ServiceUnavailableException,
      );
      expect(saveMock).not.toHaveBeenCalled();
    });
  });

  it('listOrders returns all orders', async () => {
    orderModel.find.mockResolvedValue([{ orderId: 'o1' }]);

    const result = await service.listOrders();

    expect(result).toEqual({ success: true, data: [{ orderId: 'o1' }] });
  });

  it('userOrders returns orders for the given user', async () => {
    orderModel.find.mockResolvedValue([{ orderId: 'o1' }]);

    const result = await service.userOrders('u1');

    expect(orderModel.find).toHaveBeenCalledWith({ userId: 'u1' });
    expect(result).toEqual({ success: true, data: [{ orderId: 'o1' }] });
  });

  it('updateStatus updates the order status', async () => {
    orderModel.findByIdAndUpdate.mockResolvedValue({});

    const result = await service.updateStatus('o1', 'Delivered');

    expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('o1', { status: 'Delivered' });
    expect(result).toEqual({ success: true, message: 'Status Updated' });
  });

  describe('verifyOrder', () => {
    it('marks the order as paid on success', async () => {
      orderModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.verifyOrder('o1', 'true');

      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('o1', { payment: true });
      expect(result).toEqual({ success: true, message: 'Paid' });
    });

    it('deletes the order on failure', async () => {
      orderModel.findByIdAndDelete.mockResolvedValue({});

      const result = await service.verifyOrder('o1', 'false');

      expect(orderModel.findByIdAndDelete).toHaveBeenCalledWith('o1');
      expect(result).toEqual({ success: false, message: 'Not Paid' });
    });
  });

  describe('handleStripeWebhook', () => {
    it('throws BadRequestException when the webhook secret is not configured', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OrderService,
          { provide: getModelToken(Order.name), useValue: orderModel },
          { provide: getModelToken(User.name), useValue: userModel },
          { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue(undefined) } },
        ],
      }).compile();
      const unconfiguredService = module.get<OrderService>(OrderService);

      await expect(
        unconfiguredService.handleStripeWebhook(Buffer.from(''), 'sig'),
      ).rejects.toThrow(BadRequestException);
    });

    it('marks the order paid on checkout.session.completed', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: { metadata: { orderId: 'o1' } } },
      } as unknown as Stripe.Event);
      orderModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.handleStripeWebhook(Buffer.from('payload'), 'sig');

      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('o1', { payment: true });
      expect(result).toEqual({ received: true });
    });

    it('deletes the order on checkout.session.expired', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.expired',
        data: { object: { metadata: { orderId: 'o1' } } },
      } as unknown as Stripe.Event);
      orderModel.findByIdAndDelete.mockResolvedValue({});

      const result = await service.handleStripeWebhook(Buffer.from('payload'), 'sig');

      expect(orderModel.findByIdAndDelete).toHaveBeenCalledWith('o1');
      expect(result).toEqual({ received: true });
    });

    it('throws BadRequestException when signature verification fails', async () => {
      mockConstructEvent.mockImplementation(() => {
        throw new Error('bad signature');
      });

      await expect(
        service.handleStripeWebhook(Buffer.from('payload'), 'sig'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
