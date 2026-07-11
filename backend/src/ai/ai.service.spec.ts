import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { AiService } from './ai.service';
import { Food } from '../food/schemas/food.schema';

const mockCreate = jest.fn();
// Wraps mock in { default: ... } because ai.service.ts uses default import and compiles to `new groq_sdk_1.default(...)` under no-esModuleInterop tsconfig.
jest.mock('groq-sdk', () => ({
  default: jest.fn().mockImplementation(() => ({
    chat: { completions: { create: mockCreate } },
  })),
}));

describe('AiService', () => {
  let foodModel: { find: jest.Mock };
  let configService: { get: jest.Mock };

  const buildService = async (apiKey: string | undefined) => {
    foodModel = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          { _id: 'f1', name: 'Curry', description: 'Spicy', price: 10, category: 'Mains' },
        ]),
      }),
    };
    configService = { get: jest.fn().mockReturnValue(apiKey) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: getModelToken(Food.name), useValue: foodModel },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    return module.get<AiService>(AiService);
  };

  afterEach(() => jest.clearAllMocks());

  it('throws BadRequestException when GROQ_API_KEY is not configured', async () => {
    const service = await buildService(undefined);

    await expect(service.getRecommendations('spicy food')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns parsed recommendations on success', async () => {
    const service = await buildService('test-key');
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({ message: 'Try the curry', itemIds: ['f1'] }),
          },
        },
      ],
    });

    const result = await service.getRecommendations('spicy food');

    expect(foodModel.find).toHaveBeenCalled();
    expect(result).toEqual({ success: true, message: 'Try the curry', itemIds: ['f1'] });
  });

  it('throws ServiceUnavailableException when the Groq call fails', async () => {
    const service = await buildService('test-key');
    mockCreate.mockRejectedValue(new Error('provider down'));

    await expect(service.getRecommendations('spicy food')).rejects.toThrow(
      ServiceUnavailableException,
    );
  });
});
