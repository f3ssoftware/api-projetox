import { Module } from '@nestjs/common';
import { CheckoutService } from './services/checkout.service';
import { CheckoutController } from './controllers/checkout.controller';
import { StoreController } from './controllers/store.controller';
import { StoreService } from './services/store.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ProductSchema } from './schemas/products.schema';

@Module({
  providers: [CheckoutService, StoreService],
  controllers: [CheckoutController, StoreController],
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Products',
        schema: ProductSchema,
      },
    ]),
  ],
})
export class CheckoutModule {}
