import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CurrencyEnum } from '../../shared/enums/currency.enum';
import { ApiProperty } from '@nestjs/swagger';

export class WalletDTO {
  @ApiProperty({ required: true })
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Field "name" is required' })
  @IsString({ message: 'Field "name" should be a string' })
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  createdAt: Date;

  // @ApiProperty({ required: true })
  // @IsNotEmpty()
  // user_id: string;
}
