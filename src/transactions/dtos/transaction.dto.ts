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
  ValidateNested,
  isNotEmpty,
} from 'class-validator';
import { TransactionType } from '../enums/transaction-types.enum';
import { Installment } from '../entities/installment.interface';
import { InstallmentDto } from './installment.dto';
import { Type } from 'class-transformer';

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstallmentDto)
  installments?: InstallmentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  observation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fine_amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fee_amount?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  payment_date?: Date;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty({ message: 'Field "wallet_id" is required' })
  wallet_id: string;
}
