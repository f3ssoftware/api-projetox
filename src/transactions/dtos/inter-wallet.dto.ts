import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export class InterWalletDto {
  @ApiProperty()
  @IsUUID()
  wallet_id: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsUUID()
  destinatary_wallet_id: string;

  @ApiProperty()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsDateString()
  due_date: Date;
}
