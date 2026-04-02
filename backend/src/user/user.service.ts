import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  private createToken(id: string) {
    return this.jwtService.sign({ id });
  }

  async loginUser(userDto: any) {
    const { email, password } = userDto;
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return { success: false, message: 'User does not exist' };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, message: 'Invalid credentials' };
      }

      const token = this.createToken(user._id.toString());
      return { success: true, token };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Error' };
    }
  }

  async registerUser(userDto: any) {
    const { name, email, password } = userDto;
    try {
      const exists = await this.userModel.findOne({ email });
      if (exists) {
        return { success: false, message: 'User already exists' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Please enter a valid email' };
      }
      if (password.length < 8) {
        return { success: false, message: 'Please enter a strong password' };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new this.userModel({
        name,
        email,
        password: hashedPassword,
      });
      const user = await newUser.save();
      const token = this.createToken(user._id.toString());
      return { success: true, token };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Error' };
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await this.userModel.findById(userId).select('-password');
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      return { success: true, data: user };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Error' };
    }
  }

  async updateProfile(userDto: any) {
    const { userId, name, password } = userDto;
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (name) {
        user.name = name;
      }

      if (password && password.trim().length > 0) {
        if (password.length < 8) {
          return {
            success: false,
            message: 'Please enter a strong password (min 8 chars)',
          };
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Error updating profile' };
    }
  }
}
