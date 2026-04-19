import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class AddFoodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  imageData: string;
}

export class RemoveFoodDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class EditFoodDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageData?: string;
}
