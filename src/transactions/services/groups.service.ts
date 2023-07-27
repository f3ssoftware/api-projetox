import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Group } from '../entities/group.interface';
import { GroupKey } from 'aws-sdk/clients/inspector2';
import { GroupDto } from '../dtos/group.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel('Group')
    private readonly groupModel: Model<Group, GroupKey>,
  ) {}

  public async list(walletId: string, filter: any) {
    console.log(walletId);
    return await this.groupModel.scan('wallet_id').eq(walletId).exec();
  }

  public async create(walletId: string, g: GroupDto) {
    return await this.groupModel.create({
      id: randomUUID(),
      color: g.color,
      label: g.label,
      name: g.name,
      wallet_id: walletId,
    });
  }
}
