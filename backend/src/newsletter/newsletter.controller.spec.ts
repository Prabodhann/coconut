import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';

describe('NewsletterController', () => {
  let controller: NewsletterController;
  let service: { subscribe: jest.Mock };

  beforeEach(async () => {
    service = { subscribe: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsletterController],
      providers: [{ provide: NewsletterService, useValue: service }],
    }).compile();

    controller = module.get<NewsletterController>(NewsletterController);
  });

  it('delegates to NewsletterService.subscribe with the email', async () => {
    const expected = { success: true, message: 'Subscribed successfully' };
    service.subscribe.mockResolvedValue(expected);

    const result = await controller.subscribe({ email: 'a@b.com' });

    expect(service.subscribe).toHaveBeenCalledWith('a@b.com');
    expect(result).toBe(expected);
  });
});
