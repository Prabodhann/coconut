import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

class AddressDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() street: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() state: string;
  @IsString() @IsNotEmpty() zipcode: string;
  @IsString() @IsNotEmpty() country: string;
  @IsString() @IsNotEmpty() phone: string;
}

export class PlaceOrderDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @Min(1)
  amount: number;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

export class UserOrdersDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}

export class VerifyOrderDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  success: string;
}
