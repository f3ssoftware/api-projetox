import { ApiProperty, ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { SortOrder } from '../../shared/enums/sort-order.enum';

export class WalletFilterDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  sortBy: string;

  @ApiPropertyOptional()
  sortOrder: SortOrder;
}
