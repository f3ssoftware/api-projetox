import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { StoreService } from '../services/store.service';

@Controller({ version: ['1'], path: 'store' })
@ApiTags('Store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiBearerAuth()
  public listProducts() {
    return this.storeService.listProducts();
  }

  @Get('product/:product_id')
  @ApiParam({ name: 'product_id', type: 'string' })
  @ApiBearerAuth()
  public getProduct(@Param('product_id') productId: string) {
    return this.storeService.getProduct(productId);
  }
}
