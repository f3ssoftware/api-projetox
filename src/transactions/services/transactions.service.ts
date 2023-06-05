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
  async list() {
    return this.transactionModel.scan().exec();
  }

  async create(t: TransactionDTO) {
    for (const installment of t.installments) {
      if (installment.due_date > t.due_date) {
        throw new Error(`Installment ${installment.due_date}: Invalid Date`);
      }
    }

    return this.transactionModel.create({
      id: randomUUID(),
      amount: t.amount,
      created_at: new Date(t.createdAt),
      paid: t.paid,
      type: t.type,
      due_date: t.due_date,
      observation: t.observation,
      installments:
        t.installments.length > 0
          ? t.installments
          : [{ amount: t.amount, number: 1, due_date: t.due_date }],
      wallet_id: t.wallet_id,
    });
  }
}
