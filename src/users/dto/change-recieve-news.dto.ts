import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ChangeRecieveNewsDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsBoolean()
  receiveNews: boolean;
}
