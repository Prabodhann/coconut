import { Controller, Post, Get, Put, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  loginUser(@Body() body: any) {
    return this.userService.loginUser(body);
  }

  @Post('register')
  registerUser(@Body() body: any) {
    return this.userService.registerUser(body);
  }

  @Get('profile')
  getProfile(@Body() body: any) {
    return this.userService.getProfile(body.userId);
  }

  @Put('profile')
  updateProfile(@Body() body: any) {
    return this.userService.updateProfile(body);
  }
}
