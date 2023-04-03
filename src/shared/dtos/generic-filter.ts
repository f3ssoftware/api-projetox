import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsObject, IsOptional } from 'class-validator';
import { SortOrder } from '../enums/sort-order.enum';
import { toNumber } from '../helpers/cast.helper';

export class GenericFilter {
  @ApiProperty()
  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber({}, { message: 'O atributo "page" deve ser um número' })
  public page: number;

  @ApiProperty()
  @Transform(({ value }) => toNumber(value, { default: 10, min: 1 }))
  @IsNumber({}, { message: 'O atributo "notBefore" deve ser um número' })
  public pageSize: number;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  public orderBy?: string;

  @ApiPropertyOptional()
  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}
