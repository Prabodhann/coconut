import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { Subscriber } from './schemas/subscriber.schema';

const mockSend = jest.fn();
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

describe('NewsletterService', () => {
  let service: NewsletterService;
  let subscriberModel: { findOne: jest.Mock; create: jest.Mock };

  beforeEach(async () => {
    subscriberModel = { findOne: jest.fn(), create: jest.fn() };
    mockSend.mockReset();
    mockSend.mockResolvedValue({ error: null });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsletterService,
        { provide: getModelToken(Subscriber.name), useValue: subscriberModel },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('key') },
        },
      ],
    }).compile();

    service = module.get<NewsletterService>(NewsletterService);
  });

  it('creates a subscriber and sends the welcome email', async () => {
    subscriberModel.findOne.mockResolvedValue(null);
    subscriberModel.create.mockResolvedValue({ email: 'a@b.com' });

    const result = await service.subscribe('a@b.com');

    expect(subscriberModel.create).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(mockSend).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: 'Subscribed successfully',
    });
  });

  it('throws ConflictException when the email is already subscribed', async () => {
    subscriberModel.findOne.mockResolvedValue({ email: 'a@b.com' });

    await expect(service.subscribe('a@b.com')).rejects.toThrow(
      ConflictException,
    );
    expect(subscriberModel.create).not.toHaveBeenCalled();
  });
});
