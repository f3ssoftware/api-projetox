import { ApiProperty, ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortOrder } from 'dynamoose/dist/General';

export class WalletFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortBy: string;

  @ApiPropertyOptional()
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder: SortOrder;
}
