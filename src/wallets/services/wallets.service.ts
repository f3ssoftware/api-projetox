import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Wallet, WalletKey } from '../entities/wallet.interface';
import { WalletDTO } from '../dtos/wallet.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel('Wallet')
    private model: Model<Wallet, WalletKey>,
  ) {}

  async listAll() {
    return this.model.scan().exec();
  }

  async create(w: WalletDTO) {
    return this.model.create({
      id: randomUUID(),
      code: 10000,
      createdAt: new Date(w.createdAt),
      currency: w.currency,
      name: w.name,
      user_id: w.user_id,
    });
  }
}
