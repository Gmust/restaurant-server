import { IsNotEmpty } from 'class-validator';

export class DeleteOrderDto {
  @IsNotEmpty()
  orderId: string;
}
