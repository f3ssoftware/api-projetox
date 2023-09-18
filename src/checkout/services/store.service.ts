import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Product, ProductKey } from '../entities/product.inteface';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel('Products')
    private readonly productsModel: Model<Product, ProductKey>,
  ) {}

  public async listProducts() {
    return this.productsModel.scan().exec();
  }
}
