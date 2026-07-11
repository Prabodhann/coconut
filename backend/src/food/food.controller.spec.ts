import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { AdminGuard } from '../auth/admin.guard';
import { CanActivate } from '@nestjs/common';

describe('FoodController', () => {
  let controller: FoodController;
  let service: {
    addFood: jest.Mock;
    listFood: jest.Mock;
    removeFood: jest.Mock;
    editFood: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      addFood: jest.fn(),
      listFood: jest.fn(),
      removeFood: jest.fn(),
      editFood: jest.fn(),
    };

    const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodController],
      providers: [{ provide: FoodService, useValue: service }],
    })
      .overrideGuard(AdminGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<FoodController>(FoodController);
  });

  it('addFood delegates to FoodService.addFood', () => {
    const dto = {
      name: 'Curry',
      description: 'Spicy',
      price: 12,
      category: 'Mains',
      imageData: 'x',
    };
    const expected = { success: true, message: 'Food Added' };
    service.addFood.mockReturnValue(expected);

    const result = controller.addFood(dto);

    expect(service.addFood).toHaveBeenCalledWith(dto);
    expect(result).toBe(expected);
  });

  it('listFood delegates to FoodService.listFood', () => {
    const expected = { success: true, data: [] };
    service.listFood.mockReturnValue(expected);

    const result = controller.listFood();

    expect(service.listFood).toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  it('removeFood delegates to FoodService.removeFood', () => {
    const expected = { success: true, message: 'Food Removed' };
    service.removeFood.mockReturnValue(expected);

    const result = controller.removeFood({ id: 'f1' });

    expect(service.removeFood).toHaveBeenCalledWith('f1');
    expect(result).toBe(expected);
  });

  it('editFood delegates to FoodService.editFood', () => {
    const dto = { id: 'f1', name: 'New Name' };
    const expected = { success: true, message: 'Food Updated Successfully' };
    service.editFood.mockReturnValue(expected);

    const result = controller.editFood(dto);

    expect(service.editFood).toHaveBeenCalledWith(dto);
    expect(result).toBe(expected);
  });
});
