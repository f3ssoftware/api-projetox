import { Module } from '@nestjs/common';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamoDB } from 'aws-sdk';
import { TransactionSchema } from './schemas/transaction.schema';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Transaction',
        schema: TransactionSchema,
      },
    ]),
  ],
})
export class TransactionsModule {}
