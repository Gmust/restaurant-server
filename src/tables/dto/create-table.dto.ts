import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTableDto {
  @ApiProperty({
    example: 'Table num',
    description: 'Number of table',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  tableNum: number;

  @ApiProperty({
    example: 2,
    description: 'Set amount of seats',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  numberOfSeats: number;

  @ApiProperty({
    example: true,
    description: 'Is table available aat the moment',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;
}
