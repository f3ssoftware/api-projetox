import { Body, Controller, Get, Injectable, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RecurrencyDto } from '../dtos/recurrency.dto';
import { RecurrencyService } from '../services/recurrency.service';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesEnum } from '../../shared/enums/roles.enum';

@Controller({ version: ['1'], path: 'recurrency' })
@ApiTags('Recurrency')
export class RecurrencyController {
  constructor(private readonly recurrencyService: RecurrencyService) {}

  @Post()
  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @ApiBearerAuth()
  public async create(@Body() r: RecurrencyDto) {
    return await this.recurrencyService.create(r);
  }

  @Get('/:wallet_id')
  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @ApiBearerAuth()
  @ApiQuery({ name: 'wallet_id', type: 'string' })
  public async list(@Query() wallet_id: string) {
    return await this.recurrencyService.list(wallet_id);
  }
}
