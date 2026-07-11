import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { FoodService } from './food.service';
import { Food } from './schemas/food.schema';

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe('FoodService', () => {
  let service: FoodService;
  let foodModelCtor: jest.Mock;
  let foodModel: {
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndDelete: jest.Mock;
  };
  let saveMock: jest.Mock;

  beforeEach(async () => {
    saveMock = jest.fn().mockResolvedValue(undefined);
    foodModelCtor = jest.fn().mockImplementation((doc: Record<string, unknown>) => ({
      ...doc,
      save: saveMock,
    })) as unknown as jest.Mock;
    foodModel = Object.assign(foodModelCtor, {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndDelete: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodService, { provide: getModelToken(Food.name), useValue: foodModel }],
    }).compile();

    service = module.get<FoodService>(FoodService);
    jest.clearAllMocks();
    saveMock.mockResolvedValue(undefined);
  });

  const foodDto = {
    name: 'Curry',
    description: 'Spicy',
    price: 12,
    category: 'Mains',
    imageData: 'data:image/png;base64,...',
  };

  describe('addFood', () => {
    it('uploads the image and saves the food item', async () => {
      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({
        secure_url: 'https://img/1.png',
        public_id: 'cloud1',
      });

      const result = await service.addFood(foodDto);

      expect(cloudinary.uploader.upload).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ success: true, message: 'Food Added' });
    });

    it('throws ServiceUnavailableException when the image upload fails', async () => {
      (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(new Error('cloudinary down'));

      await expect(service.addFood(foodDto)).rejects.toThrow(ServiceUnavailableException);
    });
  });

  describe('listFood', () => {
    it('returns all food items', async () => {
      foodModel.find.mockResolvedValue([{ name: 'Curry' }]);

      const result = await service.listFood();

      expect(result).toEqual({ success: true, data: [{ name: 'Curry' }] });
    });
  });

  describe('removeFood', () => {
    it('deletes the food item and its cloudinary image', async () => {
      foodModel.findById.mockResolvedValue({ cloudinaryId: 'cloud1' });
      foodModel.findByIdAndDelete.mockResolvedValue({});
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({});

      const result = await service.removeFood('f1');

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('cloud1');
      expect(foodModel.findByIdAndDelete).toHaveBeenCalledWith('f1');
      expect(result).toEqual({ success: true, message: 'Food Removed' });
    });

    it('throws NotFoundException when the food item does not exist', async () => {
      foodModel.findById.mockResolvedValue(null);

      await expect(service.removeFood('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('editFood', () => {
    it('updates fields without touching the image when imageData is absent', async () => {
      const existing = { name: 'Old', description: 'Old desc', price: 5, category: 'Old', cloudinaryId: 'cloud1', save: saveMock };
      foodModel.findById.mockResolvedValue(existing);

      const result = await service.editFood({ id: 'f1', name: 'New Name' });

      expect(existing.name).toBe('New Name');
      expect(saveMock).toHaveBeenCalled();
      expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
      expect(result).toEqual({ success: true, message: 'Food Updated Successfully' });
    });

    it('throws NotFoundException when the food item does not exist', async () => {
      foodModel.findById.mockResolvedValue(null);

      await expect(service.editFood({ id: 'missing' })).rejects.toThrow(NotFoundException);
    });
  });
});
