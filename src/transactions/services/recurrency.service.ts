import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Recurrency, RecurrencyKey } from '../entities/recurrency.interface';
import { RecurrencyDto } from '../dtos/recurrency.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class RecurrencyService {
  constructor(
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

  async detail(recurrency_id: string) {
    return await this.recurrencyModel.get({ id: recurrency_id });
  }
}
