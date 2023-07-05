import { Injectable } from '@nestjs/common';
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

  async list(walletId: string) {
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

  @Cron('0 00 07 * * 1-7')
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

  private createTransactionByRecurrency(recurrency: Recurrency) {
    this.transactionsService.create({
      amount: recurrency.amount,
      createdAt: new Date(),
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
}
