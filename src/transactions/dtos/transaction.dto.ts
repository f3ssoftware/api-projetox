import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  isNotEmpty,
} from 'class-validator';
import { TransactionType } from '../enums/transaction-types.enum';
import { Installment } from '../entities/installment.interface';
import { InstallmentDto } from './installment.dto';

export class TransactionDTO {
  @ApiProperty()
  @IsNumber({ allowNaN: false })
  @IsNotEmpty({ message: 'Field "amount" is required' })
  amount: number;

  @ApiProperty()
  @IsEnum(TransactionType)
  @IsNotEmpty({ message: 'Field "type" is required' })
  type: TransactionType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Field "reference" is required' })
  reference: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty({ message: 'Field "dueDate" is required.' })
  due_date: Date;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty({ message: 'Field "paid" is required' })
  paid: boolean;

  @ApiProperty()
  @IsArray({ message: 'Field "installments" is required' })
  installments?: InstallmentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  observation: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty({ message: 'Field "wallet_id" is required' })
  wallet_id: string;
}
