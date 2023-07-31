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
import { SortOrder } from 'dynamoose/dist/General';
import { Installment } from '../entities/installment.interface';
import { InstallmentDto } from '../dtos/installment.dto';
import { InterWalletDto } from '../dtos/inter-wallet.dto';
import { RecurrencyService } from './recurrency.service';
import { TransactionCategoryEnum } from '../dtos/transaction-category.dto';
import { PayTransactionDto } from '../dtos/pay-transaction.dto';
import { CurrencyEnum } from '../../shared/enums/currency.enum';
import { transaction } from 'dynamoose';

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

    switch (filter.category) {
      case TransactionCategoryEnum.DUE_DATED:
        {
          result = result
            .where('due_date')
            .le(new Date().getTime())
            .and()
            .where('paid')
            .eq(false);
        }
        break;
      case TransactionCategoryEnum.PAYABLE:
        {
          result = result
            .where('type')
            .eq(TransactionType.PAYMENT)
            .and()
            .where('paid')
            .and()
            .where('due_date')
            .gt(new Date().getTime())
            .eq(false);
        }
        break;
      case TransactionCategoryEnum.RECEIVABLE: {
        result = result
          .where('type')
          .eq(TransactionType.BILLING)
          .and()
          .where('paid')
          .eq(false);
      }
    }

    if (filter.startDate && filter.endDate) {
      result = result
        .where('due_date')
        .ge(new Date(filter.startDate).getTime())
        .and()
        .where('due_date')
        .le(new Date(filter.endDate).getTime());
    }

    if (filter.minAmount && filter.maxAmount) {
      result
        .where('amount')
        .between(Number(filter.minAmount), Number(filter.maxAmount));
    }

    if (filter.reference) {
      result.where('reference').contains(filter.reference.toUpperCase());
    }

    return this.sortBy(filter.sortBy, filter.sortOrder, await result.exec());
  }

  async pay(userId: string, transactionId: string, t: PayTransactionDto) {
    const transaction = await this.transactionModel.get({ id: transactionId });

    if (transaction.paid) {
      throw new ConflictException('Transação já paga');
    }

    if (!(await this.checkWalletOwner(userId, transaction.wallet_id))) {
      throw new UnauthorizedException(
        'Usuário não possui acesso aos dados dessa carteira',
      );
    }

    console.log('DUE DATE: ', transaction.due_date);
    return await this.transactionModel.update(
      {
        id: transaction.id,
      },
      {
        amount: transaction.amount,
        created_at: new Date(transaction.created_at),
        due_date: new Date(transaction.due_date),
        observation: transaction.observation,
        installments: transaction.installments,
        parent_transaction_id: transaction.parent_transaction_id,
        reference: transaction.reference,
        type: transaction.type,
        wallet_id: transaction.wallet_id,
        fee_amount: t.fee_amount,
        fine_amount: t.fine_amount,
        paid: true,
        payment_date: new Date(t.payment_date),
      },
    );
  }
  async create(userId: string, t: TransactionDTO) {
    if (!(await this.checkWalletOwner(userId, t.wallet_id))) {
      throw new UnauthorizedException(
        'Usuário não possui acesso aos dados dessa carteira',
      );
    }

    if (t.installments) {
      let sumInstallments = 0;
      for (const installment of t.installments) {
        if (installment.due_date > t.due_date) {
          throw new ConflictException(
            `Installment ${installment.due_date}: Invalid Date`,
          );
        }

        sumInstallments = sumInstallments + installment.amount;

        installment.due_date = new Date(installment.due_date);
      }

      if (sumInstallments !== t.amount) {
        throw new ConflictException(
          `Transaction amount and Installments amount sum are divergent.`,
        );
      }
    }

    const savedTransaction = await this.transactionModel.create({
      id: randomUUID(),
      amount:
        t.type === TransactionType.PAYMENT && t.amount > 0
          ? t.amount * -1
          : t.amount,
      created_at: new Date(),
      paid: t.paid,
      type: t.type,
      due_date: new Date(t.due_date),
      reference: t.reference.toUpperCase(),
      observation: t.observation,
      installments:
        t?.installments?.length > 0
          ? this.parseInstallments(t?.installments)
          : [
              {
                amount: t.amount,
                number: 1,
                due_date: new Date(t.due_date),
                paid: t.paid,
              },
            ],
      wallet_id: t.wallet_id,
    });

    this.generateAffiliatedTransactions(savedTransaction);

    return savedTransaction;
  }

  async createInterWalletTransaction(
    userId: string,
    interWalletDto: InterWalletDto,
  ) {
    if (!(await this.checkWalletOwner(userId, interWalletDto.wallet_id))) {
      throw new UnauthorizedException(
        'Usuário não possui acesso aos dados dessa carteira',
      );
    }

    const t1 = await this.transactionModel.create({
      id: randomUUID(),
      amount: interWalletDto.amount,
      created_at: new Date(),
      installments: [
        {
          amount: interWalletDto.amount,
          due_date: new Date(interWalletDto.due_date),
          number: 1,
          paid: true,
        },
      ],
      paid: true,
      reference: interWalletDto.reference,
      type: TransactionType.PAYMENT,
      due_date: new Date(interWalletDto.due_date),
      wallet_id: interWalletDto.wallet_id,
    });

    const t2 = await this.transactionModel.create({
      id: randomUUID(),
      amount: interWalletDto.amount,
      created_at: new Date(),
      installments: [
        {
          amount: interWalletDto.amount,
          due_date: new Date(interWalletDto.due_date),
          number: 1,
          paid: true,
        },
      ],
      paid: true,
      reference: `*INTERWALLET ${interWalletDto.reference}`,
      observation: `INTER WALLET TRANSFER FROM ${interWalletDto.wallet_id}`,
      type: TransactionType.BILLING,
      due_date: new Date(interWalletDto.due_date),
      wallet_id: interWalletDto.destinatary_wallet_id,
    });

    return { t1, t2 };
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
    const walletTransactionsVolume = transactions.length;

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
      walletTransactionsVolume,
    };
  }

  async getCashFlowByFilter(
    userId: string,
    filter: { walletId: string; currency: CurrencyEnum },
  ) {
    const wallets = await this.walletService.listAllByUser(userId);
    // if (!(await this.checkWalletOwner(userId, wallet_id))) {
    //   throw new UnauthorizedException(
    //     'Usuário não possui acesso aos dados dessa carteira',
    //   );
    // }

    let transactions = [];

    if (filter.walletId === filter.walletId) {
      transactions = transactions.concat(
        await this.transactionModel
          .scan('wallet_id')
          .eq(filter.walletId)
          .exec(),
      );
    }

    if (filter.currency && !filter.walletId) {
      for (const wallet of wallets) {
        if (wallet.currency === filter.currency) {
          transactions = transactions.concat(
            await this.transactionModel
              .scan('wallet_id')
              .eq(filter.walletId)
              .exec(),
          );
        }
      }
    }

    return transactions
      .sort((a, b) => {
        if (new Date(a.due_date).getTime() < new Date(b.due_date).getTime()) {
          return -1;
        }
        if (new Date(a.due_date).getTime() > new Date(b.due_date).getTime()) {
          return 1;
        }
        return 0;
      })
      .map((t) => {
        return [t.due_date, t.amount];
      });
  }

  public async getProfitChartByFilter(
    userId: string,
    filter: { currency: CurrencyEnum; year: number },
  ) {
    const wallets = await this.walletService.listAllByUser(userId);
    const chart: any = {};
    // let transactions = [];
    for (const wallet of wallets) {
      if (wallet.currency === filter.currency) {
        const transactions = await this.transactionModel
          .scan('wallet_id')
          .where(wallet.id)
          .and()
          .where('due_date')
          .ge(new Date(filter.year, 1, 1).getTime())
          .and()
          .where('due_date')
          .le(new Date(filter.year + 1, 12, 31).getTime())
          .exec();
        chart[wallet.name] = {
          1: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 1 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
          2: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 2 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
          3: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 3 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
          4: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 4 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
          5: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 5 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
          6: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 6 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
          7: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 7 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
          8: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 8 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
          9: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 9 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
          10: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 10 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
          11: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 11 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
          12: this.computeProfit(
            transactions.filter((t) => {
              return (
                t.due_date.getMonth() === 12 &&
                t.due_date.getFullYear() === filter.year
              );
            }),
          ),
        };
      }
    }

    return chart;
  }

  private computeProfit(transactions: Transaction[]) {
    let profit = 0;

    console.log(transactions);
    for (const transaction of transactions) {
      profit = Number(profit) + Number(transaction.amount);
      // Number(transaction.fee_amount) +
      // Number(transaction.fine_amount);
    }

    return profit;
  }

  private async checkWalletOwner(userId: string, walletId: string) {
    console.log(walletId);
    const wallet = await this.walletService.getById(walletId);
    return wallet.user_id === userId;
  }

  private sortBy(attributeName: string, order: SortOrder, elements: any[]) {
    switch (order) {
      case SortOrder.ascending:
        {
          elements.sort((a, b) => {
            if (a[attributeName] < b[attributeName]) {
              return -1;
            }
            if (a[attributeName] > b[attributeName]) {
              return 1;
            }
            return 0;
          });
        }
        break;
      case SortOrder.descending:
        {
          elements.sort((a, b) => {
            if (a[attributeName] > b[attributeName]) {
              return -1;
            }
            if (a[attributeName] < b[attributeName]) {
              return 1;
            }
            return 0;
          });
        }
        break;
      default: {
        elements.sort((a, b) => {
          if (a.due_date > b.due_date) {
            return -1;
          }
          if (a.due_date < b.due_date) {
            return 1;
          }
          return 0;
        });
      }
    }

    return elements;
  }

  private generateAffiliatedTransactions(parentTransaction: Transaction) {
    const installments = parentTransaction.installments;
    for (const i of installments) {
      this.transactionModel.create({
        amount: i.amount,
        due_date: i.due_date,
        reference: `${parentTransaction.reference} ${i.number}/${installments.length}`,
        paid: i.paid,
        type: parentTransaction.type,
        observation: parentTransaction.observation,
        wallet_id: parentTransaction.wallet_id,
        parent_transaction_id: parentTransaction.id,
      });
    }
  }

  private parseInstallments(installmentDtoList: InstallmentDto[]) {
    const installments: Installment[] = [];
    for (const dto of installmentDtoList) {
      installments.push({
        amount: dto.amount,
        number: dto.number,
        due_date: dto.due_date,
        paid: dto.paid,
      });
    }

    return installments;
  }
}
