import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

describe('AiController', () => {
  let controller: AiController;
  let service: { getRecommendations: jest.Mock };

  beforeEach(async () => {
    service = { getRecommendations: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [{ provide: AiService, useValue: service }],
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it('delegates to AiService.getRecommendations with the query and returns its result', async () => {
    const expected = {
      success: true,
      message: 'Try the curry',
      itemIds: ['1'],
    };
    service.getRecommendations.mockResolvedValue(expected);

    const result = await controller.getRecommendation({
      query: 'something spicy',
    });

    expect(service.getRecommendations).toHaveBeenCalledWith('something spicy');
    expect(result).toBe(expected);
  });
});
