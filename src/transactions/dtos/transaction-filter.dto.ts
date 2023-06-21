import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortOrder } from '../../shared/enums/sort-order.enum';

export class TransactionFilterDto {
  //   @ApiProperty()
  //   @IsNumber({}, { message: 'page attribute must be a number' })
  //   public page: number;

  //   @ApiProperty()
  //   @IsNumber({}, { message: 'pageSize attribute must be a number' })
  //   public pageSize: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  public startDate: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  public endDate: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public reference: string;

  @ApiPropertyOptional()
  //   @IsNumber({}, { message: 'minAmount attribute must be a number' })
  @IsOptional()
  public minAmount: number;

  @ApiPropertyOptional()
  //   @IsNumber({}, { message: 'maxAmount attribute must be a number' })
  @IsOptional()
  public maxAmount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public sortBy: string;

  @ApiPropertyOptional()
  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder: SortOrder;
}
