import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Transaction, TransactionKey } from '../entities/transaction.interface';
import { TransactionDTO } from '../dtos/transaction.dto';
import { randomUUID } from 'crypto';
import { TransactionType } from '../enums/transaction-types.enum';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    private transactionModel: Model<Transaction, TransactionKey>,
  ) {}
  async listAll() {
    return this.transactionModel.scan().exec();
  }

  async create(t: TransactionDTO) {
    return this.transactionModel.create({
      id: randomUUID(),
      amount: t.amount,
      code: 10000,
      createdAt: new Date(t.createdAt),
      paid: t.paid,
      type: t.type,
      supplier: t.supplier,
      observation: t.observation,
      installments: t.installments,
    });
  }
}
