import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed'),
}));

describe('UserService', () => {
  let service: UserService;
  let userModelCtor: jest.Mock;
  let userModel: { findOne: jest.Mock; findById: jest.Mock };
  let saveMock: jest.Mock;
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    saveMock = jest.fn().mockImplementation(function() {
      return Promise.resolve(this);
    });
    userModelCtor = jest.fn().mockImplementation((doc: Record<string, unknown>) => ({
      ...doc,
      _id: { toString: () => 'u1' },
      save: saveMock,
    })) as unknown as jest.Mock;
    userModel = Object.assign(userModelCtor, {
      findOne: jest.fn(),
      findById: jest.fn(),
    });
    jwtService = { sign: jest.fn().mockReturnValue('signed-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue(undefined) } },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
    saveMock.mockImplementation(function() {
      return Promise.resolve(this);
    });
    jwtService.sign.mockReturnValue('signed-token');
  });

  describe('loginUser', () => {
    it('returns a token on valid credentials', async () => {
      userModel.findOne.mockResolvedValue({ _id: { toString: () => 'u1' }, password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.loginUser({ email: 'a@b.com', password: 'secret123' });

      expect(result).toEqual({ success: true, token: 'signed-token', role: 'user' });
    });

    it('throws UnauthorizedException when the user does not exist', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(
        service.loginUser({ email: 'missing@b.com', password: 'secret123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException on a password mismatch', async () => {
      userModel.findOne.mockResolvedValue({ _id: { toString: () => 'u1' }, password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.loginUser({ email: 'a@b.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('registerUser', () => {
    it('creates a user and returns a token', async () => {
      userModel.findOne.mockResolvedValue(null);

      const result = await service.registerUser({
        name: 'A',
        email: 'a@b.com',
        password: 'secret123',
      });

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ success: true, token: 'signed-token', role: 'user' });
    });

    it('throws ConflictException when the email is already registered', async () => {
      userModel.findOne.mockResolvedValue({ email: 'a@b.com' });

      await expect(
        service.registerUser({ name: 'A', email: 'a@b.com', password: 'secret123' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getProfile', () => {
    it('returns the user profile', async () => {
      userModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ name: 'A', email: 'a@b.com' }),
      });

      const result = await service.getProfile('u1');

      expect(result).toEqual({ success: true, data: { name: 'A', email: 'a@b.com' } });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userModel.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      await expect(service.getProfile('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('updates the name and saves', async () => {
      const existing = { name: 'Old', password: 'hashed', save: saveMock };
      userModel.findById.mockResolvedValue(existing);

      const result = await service.updateProfile({ userId: 'u1', name: 'New Name' });

      expect(existing.name).toBe('New Name');
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ success: true, message: 'Profile updated successfully' });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.updateProfile({ userId: 'missing' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
