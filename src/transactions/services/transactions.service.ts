import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Transaction, TransactionKey } from '../entities/transaction.interface';
import { TransactionDTO } from '../dtos/transaction.dto';
import { randomUUID } from 'crypto';
import { TransactionType } from '../enums/transaction-types.enum';
import { contains } from 'class-validator';
import { WalletsService } from '../../wallets/services/wallets.service';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    private transactionModel: Model<Transaction, TransactionKey>,
    @Inject(forwardRef(() => WalletsService))
    private readonly walletService: WalletsService,
  ) {}
  async listBy(userId: string, t: Transaction) {
    if (!(await this.checkWalletOwner(userId, t.wallet_id))) {
      console.log('CAINDO NO ERROR');
      throw new UnauthorizedException(
        'Usuário não possui acesso aos dados dessa carteira',
      );
    }

    return this.transactionModel
      .scan({
        wallet_id: { eq: t.wallet_id },
      })
      .exec();
  }

  async create(t: TransactionDTO) {
    for (const installment of t.installments) {
      if (installment.due_date > t.due_date) {
        throw new ConflictException(
          `Installment ${installment.due_date}: Invalid Date`,
        );
      }
    }

    return this.transactionModel.create({
      id: randomUUID(),
      amount: t.amount,
      created_at: new Date(t.createdAt),
      paid: t.paid,
      type: t.type,
      due_date: new Date(t.due_date),
      reference: t.reference,
      observation: t.observation,
      installments:
        t.installments.length > 0
          ? t.installments
          : [{ amount: t.amount, number: 1, due_date: t.due_date }],
      wallet_id: t.wallet_id,
    });
  }

  async stats(walletId: string) {
    const transactions = await this.transactionModel
      .scan({
        wallet_id: {
          contains: walletId,
        },
      })
      .exec();
    let sum = 0;
    let expiredTransactionsQuantity = 0;
    for (const t of transactions) {
      sum += t.amount;
      if (
        new Date(t.due_date) < new Date() &&
        !t.paid &&
        t.type === 'BILLING'
      ) {
        expiredTransactionsQuantity++;
      }
    }

    return {
      walletBalance: sum,
      walletexpiredBillingQuantity: expiredTransactionsQuantity,
    };
  }

  private async checkWalletOwner(userId: string, walletId: string) {
    const wallet = await this.walletService.getById(walletId);
    return wallet.user_id === userId;
  }
}
