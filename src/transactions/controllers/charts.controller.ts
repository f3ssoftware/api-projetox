import { Controller, Get, Query } from '@nestjs/common';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from '../services/transactions.service';

@Controller({ version: ['1'], path: 'charts' })
@ApiTags('Charts')
export class ChartsController {
  constructor(private readonly transactionService: TransactionsService) {}
  @Get('cashflow')
  @ApiBearerAuth()
  @ApiQuery({ name: 'wallet_id', type: 'string' })
  public async getCashflowChartByWallet(
    @GetUser() userId,
    @Query('wallet_id') walletId,
  ) {
    return this.transactionService.getCashFlowByWallet(userId, walletId);
  }
}
