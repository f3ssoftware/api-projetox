import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Wallet, WalletKey } from '../entities/wallet.interface';
import { WalletDTO } from '../dtos/wallet.dto';
import { randomUUID } from 'crypto';
import { TransactionsService } from '../../transactions/services/transactions.service';
import { WalletFilterDto } from '../dtos/wallet-filter.dto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel('Wallet')
    private model: Model<Wallet, WalletKey>,
    @Inject(forwardRef(() => TransactionsService))
    private transactionService: TransactionsService,
  ) {}

  public async listAllByUser(userId: string, filter?: WalletFilterDto) {
    const result = this.model
      .scan('user_id')
      .eq(userId)
      .where('active')
      .eq(true);
    // .scan({
    //   user_id: {
    //     eq: userId,
    //   },
    // })

    if (filter.name) {
      result.where('name').contains(filter.name);
    }

    return result.exec();
  }

  public async listAll() {
    return this.model.scan().where('active').eq(true).exec();
  }

  public async getById(id: string) {
    const wallet = await this.model.get({ id });
    const stats = await this.transactionService.stats(id);

    return { ...wallet, stats };
  }

  public async create(userId: string, w: WalletDTO) {
    return this.model.create({
      id: randomUUID(),
      active: true,
      createdAt: w.createdAt ? new Date(w.createdAt) : new Date(),
      currency: w.currency,
      name: w.name,
      user_id: userId,
    });
  }

  public async update(id: string, w: WalletDTO, userId: string) {
    return await this.model.update({
      id: id,
      active: true,
      createdAt: new Date(w.createdAt),
      currency: w.currency,
      name: w.name,
      user_id: userId,
    });
  }

  async delete(id: string) {
    const w = await this.model.get({ id });
    w.active = false;
    return await this.model.update(w);
  }
}
