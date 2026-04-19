import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Please enter a strong password (min 8 chars)' })
  password: string;
}

export class LoginUserDto {
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class GetProfileDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Please enter a strong password (min 8 chars)' })
  password?: string;
}
