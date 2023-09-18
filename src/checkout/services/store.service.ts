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
    return await this.productsModel.scan().exec();
  }

  public async getProduct(productId: string) {
    return await this.productsModel.get({ id: productId });
  }
}
