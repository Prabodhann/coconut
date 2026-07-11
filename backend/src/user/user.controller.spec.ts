import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: {
    loginUser: jest.Mock;
    registerUser: jest.Mock;
    getProfile: jest.Mock;
    updateProfile: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      loginUser: jest.fn(),
      registerUser: jest.fn(),
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: service }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('loginUser delegates to UserService.loginUser', () => {
    const dto = { email: 'a@b.com', password: 'secret123' };
    const expected = { success: true, token: 't', role: 'user' };
    service.loginUser.mockReturnValue(expected);

    expect(controller.loginUser(dto)).toBe(expected);
    expect(service.loginUser).toHaveBeenCalledWith(dto);
  });

  it('registerUser delegates to UserService.registerUser', () => {
    const dto = { name: 'A', email: 'a@b.com', password: 'secret123' };
    const expected = { success: true, token: 't', role: 'user' };
    service.registerUser.mockReturnValue(expected);

    expect(controller.registerUser(dto)).toBe(expected);
    expect(service.registerUser).toHaveBeenCalledWith(dto);
  });

  it('getProfile delegates to UserService.getProfile', () => {
    const expected = { success: true, data: {} };
    service.getProfile.mockReturnValue(expected);

    expect(controller.getProfile({ userId: 'u1' })).toBe(expected);
    expect(service.getProfile).toHaveBeenCalledWith('u1');
  });

  it('updateProfile delegates to UserService.updateProfile', () => {
    const dto = { userId: 'u1', name: 'New Name' };
    const expected = { success: true, message: 'Profile updated successfully' };
    service.updateProfile.mockReturnValue(expected);

    expect(controller.updateProfile(dto)).toBe(expected);
    expect(service.updateProfile).toHaveBeenCalledWith(dto);
  });
});
