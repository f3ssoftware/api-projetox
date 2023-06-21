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

  async create(r: RecurrencyDto) {
    return await this.recurrencyModel.create({
      id: randomUUID(),
      wallet_id: r.wallet_id,
      active: true,
      amount: r.amount,
      base_date: new Date(r.base_date),
      frequency: r.frequency,
      observation: r.observation,
      paid: r.paid,
      reference: r.reference,
      type: r.type,
    });
  }

  async list(walletId: string) {
    const recurrencies = await this.recurrencyModel
      .scan('wallet_id')
      .eq(walletId)
      .where('active')
      .eq(true);

    return recurrencies;
  }
}
