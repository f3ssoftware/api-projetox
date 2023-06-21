import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../entities/transaction.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionDTO } from '../dtos/transaction.dto';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesEnum } from '../../shared/enums/roles.enum';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { TransactionFilterDto } from '../dtos/transaction-filter.dto';

@Controller({ version: ['1'], path: 'transactions' })
@ApiTags('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @ApiBearerAuth()
  @ApiParam({ name: 'wallet_id', required: true, type: 'string' })
  @Get('/:wallet_id')
  public listByWallet(
    @GetUser() userId,
    @Param('wallet_id') walletId,
    @Query() filter: TransactionFilterDto,
  ) {
    return this.transactionsService.listBy(userId, walletId, filter);
  }

  @Post('')
  public create(@Body() t: TransactionDTO) {
    return this.transactionsService.create(t);
  }
}
