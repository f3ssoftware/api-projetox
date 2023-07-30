import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class EditGroupDto {
  @ApiProperty()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional()
  @IsString()
  color?: string;
}
