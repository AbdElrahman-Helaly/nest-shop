import {
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../order.entity';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  @IsOptional()
  shippingCost?: number;

  @IsOptional()
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @IsOptional()
  paymentMethod?: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
