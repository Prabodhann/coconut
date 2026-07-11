import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { CanActivate } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AdminGuard } from '../auth/admin.guard';

describe('OrderController', () => {
  let controller: OrderController;
  let service: {
    placeOrder: jest.Mock;
    listOrders: jest.Mock;
    userOrders: jest.Mock;
    updateStatus: jest.Mock;
    verifyOrder: jest.Mock;
    handleStripeWebhook: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      placeOrder: jest.fn(),
      listOrders: jest.fn(),
      userOrders: jest.fn(),
      updateStatus: jest.fn(),
      verifyOrder: jest.fn(),
      handleStripeWebhook: jest.fn(),
    };

    // OrderController uses @UseGuards(AdminGuard) on some routes; NestJS's
    // TestingModule eagerly resolves classes referenced via guard metadata
    // during compile(), so AdminGuard must be overridden even though these
    // unit tests call controller methods directly (bypassing the HTTP guard
    // pipeline entirely).
    const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: service }],
    })
      .overrideGuard(AdminGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('placeOrder delegates to OrderService.placeOrder', () => {
    const dto = { userId: 'u1', items: [], amount: 10, address: {} } as never;
    const expected = { success: true, session_url: 'https://stripe' };
    service.placeOrder.mockReturnValue(expected);

    expect(controller.placeOrder(dto)).toBe(expected);
    expect(service.placeOrder).toHaveBeenCalledWith(dto);
  });

  it('listOrders delegates to OrderService.listOrders', () => {
    const expected = { success: true, data: [] };
    service.listOrders.mockReturnValue(expected);

    expect(controller.listOrders()).toBe(expected);
    expect(service.listOrders).toHaveBeenCalled();
  });

  it('userOrders delegates to OrderService.userOrders', () => {
    const expected = { success: true, data: [] };
    service.userOrders.mockReturnValue(expected);

    expect(controller.userOrders({ userId: 'u1' })).toBe(expected);
    expect(service.userOrders).toHaveBeenCalledWith('u1');
  });

  it('updateStatus delegates to OrderService.updateStatus', () => {
    const expected = { success: true, message: 'Status Updated' };
    service.updateStatus.mockReturnValue(expected);

    expect(
      controller.updateStatus({ orderId: 'o1', status: 'Delivered' }),
    ).toBe(expected);
    expect(service.updateStatus).toHaveBeenCalledWith('o1', 'Delivered');
  });

  it('verifyOrder delegates to OrderService.verifyOrder', () => {
    const expected = { success: true, message: 'Paid' };
    service.verifyOrder.mockReturnValue(expected);

    expect(controller.verifyOrder({ orderId: 'o1', success: 'true' })).toBe(
      expected,
    );
    expect(service.verifyOrder).toHaveBeenCalledWith('o1', 'true');
  });

  it('stripeWebhook delegates to OrderService.handleStripeWebhook', () => {
    const expected = { received: true };
    service.handleStripeWebhook.mockReturnValue(expected);
    const req = { body: Buffer.from('payload') } as unknown as Request;

    expect(controller.stripeWebhook(req, 'sig')).toBe(expected);
    expect(service.handleStripeWebhook).toHaveBeenCalledWith(req.body, 'sig');
  });
});
