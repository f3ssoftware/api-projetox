import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from '../services/transactions.service';
import { CurrencyEnum } from '../../shared/enums/currency.enum';
import { TransactionType } from '../enums/transaction-types.enum';

@Controller({ version: ['1'], path: 'charts' })
@ApiTags('Charts')
export class ChartsController {
  constructor(private readonly transactionService: TransactionsService) {}
  @Get('cashflow')
  @ApiBearerAuth()
  @ApiQuery({ name: 'wallet_id', type: 'string', required: false })
  @ApiQuery({ name: 'currency', type: 'string', required: false })
  @ApiQuery({ name: 'days_gone', type: 'number', required: true })
  public async getCashflowChartByFilter(
    @GetUser() userId: string,
    @Query('wallet_id') walletId: string,
    @Query('currency') currency: CurrencyEnum,
    @Query('days_gone') daysGone: number,
  ) {
    if (currency || walletId) {
      return this.transactionService.getCashFlowByFilter(userId, {
        walletId,
        currency,
        daysGone,
      });
    }

    throw new BadRequestException(
      'Parameters "wallet_id" or "currency" should be passed',
    );
  }

  @Get('profit')
  @ApiBearerAuth()
  @ApiQuery({ name: 'currency', type: 'string', required: true })
  @ApiQuery({ name: 'year', type: 'number', required: true })
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
  @ApiQuery({ name: 'days_gone', type: 'number', required: true })
  public async getCashInGroups(
    @GetUser() userId: string,
    @Query('currency') currency: CurrencyEnum,
    @Query('days_gone') daysGone: number,
  ) {
    return this.transactionService.getGroupedChart(
      userId,
      daysGone,
      currency,
      TransactionType.BILLING,
    );
  }

  @Get('cash-out')
  @ApiBearerAuth()
  @ApiQuery({ name: 'currency', type: 'string', required: true })
  @ApiQuery({ name: 'days_gone', type: 'number', required: true })
  public async getCashOutGroups(
    @GetUser() userId: string,
    @Query('currency') currency: CurrencyEnum,
    @Query('days_gone') daysGone: number,
  ) {
    return this.transactionService.getGroupedChart(
      userId,
      daysGone,
      currency,
      TransactionType.PAYMENT,
    );
  }
}
