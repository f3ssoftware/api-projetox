import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CurrencyEnum } from '../../shared/enums/currency.enum';
import { ApiProperty } from '@nestjs/swagger';

export class WalletDTO {
  @ApiProperty()
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;

  @ApiProperty()
  @IsNotEmpty({ message: 'Field "name" is required' })
  @IsString({ message: 'Field "name" should be a string' })
  name: string;

  @ApiProperty()
  @IsOptional()
  createdAt: Date;

  @IsNotEmpty()
  user_id: string;
}
