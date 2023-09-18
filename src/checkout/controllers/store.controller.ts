import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
}
