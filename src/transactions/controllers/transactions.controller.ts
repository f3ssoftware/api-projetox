import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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
import { InterWalletDto } from '../dtos/inter-wallet.dto';
import { PayTransactionDto } from '../dtos/pay-transaction.dto';

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
  @ApiBearerAuth()
  public create(@GetUser() userId, @Body() t: TransactionDTO) {
    return this.transactionsService.create(userId, t);
  }

  @Put('/pay/:transaction_id')
  @ApiBearerAuth()
  @ApiParam({ name: 'transaction_id', required: true, type: 'string' })
  public updateTransaction(
    @GetUser() userId,
    @Param('transaction_id') transactionId,
    @Body() t: PayTransactionDto,
  ) {
    return this.transactionsService.pay(userId, transactionId, t);
  }

  @Delete('/:transaction_id')
  @ApiBearerAuth()
  @ApiParam({ name: 'transaction_id', required: true, type: 'string' })
  public deleteTransaction(
    @GetUser() userId,
    @Param('transaction_id') transactionId,
  ) {
    return this.transactionsService.delete(userId, transactionId);
  }

  @Post('inter-wallet')
  @ApiBearerAuth()
  public createInterWalletTransfer(
    @GetUser() userId,
    @Body() interWallet: InterWalletDto,
  ) {
    return this.transactionsService.createInterWalletTransaction(
      userId,
      interWallet,
    );
  }
}
