import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  LoginUserDto,
  RegisterUserDto,
  UpdateProfileDto,
} from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  private createToken(id: string) {
    return this.jwtService.sign({ id });
  }

  async loginUser(userDto: LoginUserDto) {
    const { email, password } = userDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.createToken(user._id.toString());
    return { success: true, token };
  }

  async registerUser(userDto: RegisterUserDto) {
    const { name, email, password } = userDto;

    // Explicit runtime constraint not suitable for naive DTO mapping
    const exists = await this.userModel.findOne({ email });
    if (exists) {
      throw new ConflictException('User already exists');
    }

    // Hash logic
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
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { success: true, data: user };
  }

  async updateProfile(userDto: UpdateProfileDto) {
    const { userId, name, password } = userDto;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (name) {
      user.name = name;
    }

    if (password && password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    return { success: true, message: 'Profile updated successfully' };
  }
}
