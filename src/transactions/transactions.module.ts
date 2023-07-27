import { Module, forwardRef } from '@nestjs/common';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamoDB } from 'aws-sdk';
import { TransactionSchema } from './schemas/transaction.schema';
import { WalletsModule } from '../wallets/wallets.module';
import { RecurrencySchema } from './schemas/recurrency.schema';
import { RecurrencyService } from './services/recurrency.service';
import { RecurrencyController } from './controllers/recurrency.controller';
import { ChartsController } from './controllers/charts.controller';
import { GroupsService } from './services/groups.service';
import { GroupsController } from './controllers/groups.controller';
import { GroupSchema } from './schemas/group.schema';

@Module({
  controllers: [
    TransactionsController,
    RecurrencyController,
    ChartsController,
    GroupsController,
  ],
  providers: [TransactionsService, RecurrencyService, GroupsService],
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Transaction',
        schema: TransactionSchema,
      },
      {
        name: 'Recurrency',
        schema: RecurrencySchema,
      },
      {
        name: 'Group',
        schema: GroupSchema,
      },
    ]),
    forwardRef(() => WalletsModule),
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
