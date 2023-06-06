import { Module, forwardRef } from '@nestjs/common';
import { WalletsService } from './services/wallets.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { WalletSchema } from './schemas/wallet.schema';
import { WalletsController } from './controller/wallets.controller';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  providers: [WalletsService],
  imports: [
    forwardRef(() => TransactionsModule),
    DynamooseModule.forFeature([
      {
        name: 'Wallet',
        schema: WalletSchema,
      },
    ]),
  ],
  exports: [WalletsService],
  controllers: [WalletsController],
})
export class WalletsModule {}
