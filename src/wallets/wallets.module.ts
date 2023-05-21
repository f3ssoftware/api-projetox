import { Module } from '@nestjs/common';
import { WalletsService } from './services/wallets.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { WalletSchema } from './schemas/wallet.schema';
import { WalletsController } from './controller/wallets.controller';

@Module({
  providers: [WalletsService],
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Wallet',
        schema: WalletSchema,
      },
    ]),
  ],
  controllers: [WalletsController],
})
export class WalletsModule {}
