import { Controller, Get, Query } from '@nestjs/common';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from '../services/transactions.service';
import { CurrencyEnum } from '../../shared/enums/currency.enum';

@Controller({ version: ['1'], path: 'charts' })
@ApiTags('Charts')
export class ChartsController {
  constructor(private readonly transactionService: TransactionsService) {}
  @Get('cashflow')
  @ApiBearerAuth()
  @ApiQuery({ name: 'wallet_id', type: 'string', required: false })
  @ApiQuery({ name: 'currency', type: 'string', required: false })
  public async getCashflowChartByWallet(
    @GetUser() userId: string,
    @Query('wallet_id') walletId: string,
    @Query('currency') currency: CurrencyEnum,
  ) {
    return this.transactionService.getCashFlowByFilter(userId, {
      walletId,
      currency,
    });
  }
}
