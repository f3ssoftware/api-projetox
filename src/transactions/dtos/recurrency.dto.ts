import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
  IsBoolean,
  IsArray,
  IsUUID,
  MinDate,
  IsDate,
} from 'class-validator';
import { Installment } from '../entities/installment.interface';
import { TransactionType } from '../enums/transaction-types.enum';
import { FrequencyType } from '../enums/frequency-type.enum';
import { Transform } from 'class-transformer';

export class RecurrencyDto {
  @ApiProperty()
  @IsNumber({ allowNaN: false })
  @IsNotEmpty({ message: 'Field "amount" is required' })
  amount: number;

  @ApiProperty()
  @IsEnum(FrequencyType)
  @IsNotEmpty({ message: 'Field "frequency" is required' })
  frequency: FrequencyType;

  @ApiProperty()
  @IsEnum(TransactionType)
  @IsNotEmpty({ message: 'Field "type" is required' })
  type: TransactionType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Field "reference" is required' })
  reference: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @MinDate(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1,
    ),
  )
  @IsNotEmpty({ message: 'Field "base_date" is required.' })
  base_date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  observation: string;

  @ApiProperty()
  @IsBoolean()
  includeWeekends: boolean;
}
