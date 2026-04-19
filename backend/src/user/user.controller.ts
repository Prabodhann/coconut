import { Controller, Post, Get, Put, Body } from '@nestjs/common';
import { UserService } from './user.service';
import {
  RegisterUserDto,
  LoginUserDto,
  GetProfileDto,
  UpdateProfileDto,
} from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  loginUser(@Body() body: LoginUserDto) {
    return this.userService.loginUser(body);
  }

  @Post('register')
  registerUser(@Body() body: RegisterUserDto) {
    return this.userService.registerUser(body);
  }

  @Get('profile')
  getProfile(@Body() body: GetProfileDto) {
    return this.userService.getProfile(body.userId);
  }

  @Put('profile')
  updateProfile(@Body() body: UpdateProfileDto) {
    return this.userService.updateProfile(body);
  }
}
