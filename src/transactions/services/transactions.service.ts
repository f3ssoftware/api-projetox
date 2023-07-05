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
import { TransactionFilterDto } from '../dtos/transaction-filter.dto';
import { Recurrency, RecurrencyKey } from '../entities/recurrency.interface';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    private transactionModel: Model<Transaction, TransactionKey>,
    @Inject(forwardRef(() => WalletsService))
    private readonly walletService: WalletsService,
  ) {}

  async listBy(
    userId: string,
    wallet_id: string,
    filter: TransactionFilterDto,
  ) {
    if (!(await this.checkWalletOwner(userId, wallet_id))) {
      throw new UnauthorizedException(
        'Usuário não possui acesso aos dados dessa carteira',
      );
    }

    let result = this.transactionModel.scan('wallet_id').eq(wallet_id);
    // let result = this.transactionModel.query('wallet_id').eq(wallet_id);

    if (filter.startDate && filter.endDate) {
      result = result
        .where('due_date')
        .gt(new Date(filter.startDate).getTime())
        .and()
        .where('due_date')
        .lt(new Date(filter.endDate).getTime());
    }

    if (filter.minAmount && filter.maxAmount) {
      result
        .where('amount')
        .between(Number(filter.minAmount), Number(filter.maxAmount));
    }

    if (filter.reference) {
      result.where('reference').contains(filter.reference);
    }

    // result.sort(filter.sortOrder);

    return result.exec();
  }

  async create(t: TransactionDTO) {
    if (t.installments) {
      for (const installment of t.installments) {
        if (installment.due_date > t.due_date) {
          throw new ConflictException(
            `Installment ${installment.due_date}: Invalid Date`,
          );
        }

        installment.due_date = new Date(installment.due_date);
      }
    }

    return this.transactionModel.create({
      id: randomUUID(),
      amount:
        t.type === TransactionType.PAYMENT && t.amount > 0
          ? t.amount * -1
          : t.amount,
      created_at: new Date(),
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
    let expiredTransactionsAmount = 0;
    let incomeTransactionsQuantity = 0;
    let incomeTransactionsAmount = 0;
    let outcomeTransactionsQuantity = 0;
    let outcomeTransactionsAmount = 0;
    for (const t of transactions) {
      if (t.paid) {
        sum += t.amount;
      }

      if (
        new Date(t.due_date) < new Date() &&
        !t.paid &&
        t.type === 'PAYMENT'
      ) {
        expiredTransactionsQuantity++;
        expiredTransactionsAmount = expiredTransactionsAmount + t.amount;
      }

      if (t.type === 'BILLING' && !t.paid) {
        incomeTransactionsQuantity++;
        incomeTransactionsAmount = incomeTransactionsAmount + t.amount;
      }

      if (
        new Date(t.due_date) > new Date() &&
        t.type === 'PAYMENT' &&
        !t.paid
      ) {
        outcomeTransactionsQuantity++;
        outcomeTransactionsAmount = outcomeTransactionsAmount + t.amount;
      }
    }

    return {
      walletBalance: sum,
      walletExpiredBillingQuantity: expiredTransactionsQuantity,
      walletExpiredBillingAmount: expiredTransactionsAmount,
      walletIncomeBillingQuantity: incomeTransactionsQuantity,
      walletIncomeBillingAmount: incomeTransactionsAmount,
      walletOutcomeBillingQuantity: outcomeTransactionsQuantity,
      walletOutcomeBillingAmount: outcomeTransactionsAmount,
    };
  }

  private async checkWalletOwner(userId: string, walletId: string) {
    const wallet = await this.walletService.getById(walletId);
    return wallet.user_id === userId;
  }
}
