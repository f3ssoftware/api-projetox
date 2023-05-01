import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isNotEmpty,
} from 'class-validator';
import { TransactionType } from '../enums/transaction-types.enum';

export class TransactionDTO {
  @ApiProperty()
  @IsNumber({ allowNaN: false })
  @IsNotEmpty({ message: 'Field "amount" is required' })
  amount: number;

  @ApiProperty()
  @IsOptional()
  createdAt: Date;

  @ApiProperty()
  @IsEnum(TransactionType)
  @IsNotEmpty({ message: 'Field "type" is required' })
  type: TransactionType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Field "supplier" is required' })
  supplier: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty({ message: 'Field "supplier" is required' })
  paid: boolean;

  @ApiProperty()
  @IsOptional()
  installments?: any[];

  @ApiProperty()
  observation: string;
}
