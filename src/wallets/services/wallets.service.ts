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

  async getById(id: string) {
    return this.model.get({ id });
  }

  async create(userId: string, w: WalletDTO) {
    return this.model.create({
      id: randomUUID(),
      createdAt: w.createdAt ? new Date(w.createdAt) : new Date(),
      currency: w.currency,
      name: w.name,
      user_id: userId,
    });
  }

  async update(id: string, w: WalletDTO, userId: string) {
    this.model.update({
      id: id,
      createdAt: w.createdAt,
      currency: w.currency,
      name: w.name,
      user_id: userId,
    });
  }

  async delete(id: string) {
    this.model.delete({ id });
  }
}
