import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTableDto {
  @ApiProperty({
    example: '65a560c2ed6b563a2d80477bff3g35g4',
    description: 'Id of table',
    type: String,
  })
  @IsNotEmpty()
  tableId: string;

  @ApiProperty({
    example: 2,
    description: 'Number of table of table',
    type: Number,
  })
  @IsOptional()
  tableNum: number;

  @ApiProperty({
    example: 2,
    description: 'Number of seats',
    type: Number,
  })
  @IsOptional()
  numberOfSeats: number;

  @ApiProperty({
    example: false,
    description: 'Is table available',
    type: Boolean,
  })
  @IsOptional()
  isAvailable: boolean;
}
