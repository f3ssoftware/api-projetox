import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Recurrency, RecurrencyKey } from '../entities/recurrency.interface';
import { RecurrencyDto } from '../dtos/recurrency.dto';
import { randomUUID } from 'crypto';
import { WalletsService } from '../../wallets/services/wallets.service';
import { FrequencyType } from '../enums/frequency-type.enum';
import compareAsc from 'date-fns/compareAsc';
import { TransactionsService } from './transactions.service';
import { TransactionType } from '../enums/transaction-types.enum';
import { add, format } from 'date-fns';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RecurrencyService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly walletService: WalletsService,
    @InjectModel('Recurrency')
    private recurrencyModel: Model<Recurrency, RecurrencyKey>,
  ) {}

  async create(walletId: string, r: RecurrencyDto) {
    return await this.recurrencyModel.create({
      id: randomUUID(),
      wallet_id: walletId,
      active: true,
      amount: r.amount,
      base_date: new Date(r.base_date),
      frequency: r.frequency,
      observation: r.observation,
      reference: r.reference,
      includeWeekends: r.includeWeekends,
      type: r.type,
    });
  }

  async findByWallet(walletId: string) {
    return await this.recurrencyModel
      .scan('wallet_id')
      .eq(walletId)
      .where('active')
      .eq(true)
      .exec();
  }

  async list(userId, walletId: string) {
    if (!(await this.checkWalletOwner(userId, walletId))) {
      throw new UnauthorizedException(
        'Usuário não possui acesso aos dados dessa carteira',
      );
    }
    const recurrencies = await this.recurrencyModel
      .scan('wallet_id')
      .eq(walletId)
      .where('active')
      .eq(true)
      .exec();

    return recurrencies;
  }

  async update(r: RecurrencyDto, recurrency_id: string, walletId: string) {
    const toUpdate: Recurrency = {
      id: recurrency_id,
      active: true,
      wallet_id: walletId,
      ...r,
    };

    return await this.recurrencyModel.update(toUpdate);
  }

  public async detail(recurrency_id: string) {
    return await this.recurrencyModel.get({ id: recurrency_id });
  }

  @Cron('00 10 * * *')
  public async createTransactionAuto() {
    const recurrencies = await this.recurrencyModel.scan().exec();

    for (const recurrency of recurrencies) {
      switch (recurrency.frequency) {
        case FrequencyType.DAILY:
          {
            this.checkDailyRule(recurrency);
          }
          break;
        case FrequencyType.MONTHLY:
          {
            this.checkMonthlyRule(recurrency);
          }
          break;
        case FrequencyType.WEEKLY: {
          this.checkWeeklyRule(recurrency);
        }
      }
    }
  }

  public getNext;

  private checkWeeklyRule(r: Recurrency) {
    if (r.base_date.getUTCDay() === new Date().getUTCDay()) {
      if ((this.isWeekend() && r.includeWeekends) || !this.isWeekend()) {
        this.createTransactionByRecurrency(r);
      }
    }
  }

  private checkMonthlyRule(r: Recurrency) {
    if (format(r.base_date, 'dd') === format(new Date(), 'dd')) {
      if ((this.isWeekend() && r.includeWeekends) || !this.isWeekend()) {
        this.createTransactionByRecurrency(r);
      }
    }
  }

  private checkDailyRule(recurrency: Recurrency) {
    if ((this.isWeekend() && recurrency.includeWeekends) || !this.isWeekend()) {
      this.createTransactionByRecurrency(recurrency);
    }
  }

  private async createTransactionByRecurrency(recurrency: Recurrency) {
    const wallet = await this.walletService.getById(recurrency.wallet_id);
    this.transactionsService.create(wallet.user_id, {
      amount: recurrency.amount,
      due_date: new Date(),
      observation: recurrency.observation,
      paid: false,
      reference: recurrency.reference,
      type: TransactionType[recurrency.type],
      wallet_id: recurrency.wallet_id,
      installments: [],
    });
  }

  private isWeekend() {
    return new Date().getDay() == 6 || new Date().getDay() == 0;
  }

  private async checkWalletOwner(userId: string, walletId: string) {
    const wallet = await this.walletService.getById(walletId);
    return wallet.user_id === userId;
  }
}
