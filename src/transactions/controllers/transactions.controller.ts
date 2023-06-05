import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../entities/transaction.interface';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TransactionDTO } from '../dtos/transaction.dto';

@Controller('transactions')
@ApiTags('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  @Get('')
  public listAll() {
    return this.transactionsService.list();
  }

  @Post('')
  public create(@Body() t: TransactionDTO) {
    return this.transactionsService.create(t);
  }
}
