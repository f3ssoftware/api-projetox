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
  public async getCashflowChartByFilter(
    @GetUser() userId: string,
    @Query('wallet_id') walletId: string,
    @Query('currency') currency: CurrencyEnum,
  ) {
    return this.transactionService.getCashFlowByFilter(userId, {
      walletId,
      currency,
    });
  }

  @Get('profit')
  @ApiBearerAuth()
  @ApiQuery({ name: 'currency', type: 'string', required: false })
  @ApiQuery({ name: 'year', type: 'number', required: false })
  public async getProfitChartByFilter(
    @GetUser() userId: string,
    @Query('currency') currency: CurrencyEnum,
    @Query('year') year: number,
  ) {
    return this.transactionService.getProfitChartByFilter(userId, {
      currency,
      year,
    });
  }

  @Get('currency-stats')
  @ApiBearerAuth()
  @ApiQuery({ name: 'currency', type: 'string', required: true })
  @ApiQuery({ name: 'year', type: 'string', required: true })
  public async getStatsByCurrency(
    @GetUser() userId: string,
    @Query('currency') currency: CurrencyEnum,
    @Query('year') year: number,
  ) {
    return this.transactionService.getCurrencyStats(year, currency);
  }

  @Get('cash-in')
  @ApiBearerAuth()
  @ApiQuery({ name: 'currency', type: 'string', required: true })
  @ApiQuery({ name: 'year', type: 'string', required: true })
  public async getCashInGroups(
    @GetUser() userId: string,
    @Query('currency') currency: CurrencyEnum,
    @Query('year') year: number,
  ) {
    return this.transactionService.getCashinGroupedChart(
      userId,
      year,
      currency,
    );
  }
}
