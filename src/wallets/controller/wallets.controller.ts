import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletsService } from '../services/wallets.service';
import { WalletDTO } from '../dtos/wallet.dto';

@Controller('wallets')
@ApiTags('Wallets')
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Get('')
  public listAll() {
    return this.walletService.listAll();
  }

  @Post('')
  public create(@Body() w: WalletDTO) {
    return this.walletService.create(w);
  }
}
