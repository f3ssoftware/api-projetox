import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RecurrencyDto } from '../dtos/recurrency.dto';
import { RecurrencyService } from '../services/recurrency.service';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesEnum } from '../../shared/enums/roles.enum';
import { GetUser } from '../../shared/decorators/get-user.decorator';

@Controller({ version: ['1'], path: 'recurrency' })
@ApiTags('Recurrency')
export class RecurrencyController {
  constructor(private readonly recurrencyService: RecurrencyService) {}

  @Post('/:wallet_id')
  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @ApiBearerAuth()
  public async create(
    @Param('wallet_id') walletId: string,
    @Body() r: RecurrencyDto,
  ) {
    console.log(walletId);
    return await this.recurrencyService.create(walletId, r);
  }

  @Get('/:wallet_id')
  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @ApiBearerAuth()
  public async list(
    @GetUser() userId: string,
    @Param('wallet_id') wallet_id: string,
  ) {
    return await this.recurrencyService.list(userId, wallet_id);
  }
}
