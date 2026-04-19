import { IsString, IsNotEmpty } from 'class-validator';

export class CartActionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  itemId: string;
}

export class GetCartDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
