import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { WalletsService } from '../services/wallets.service';
import { WalletDTO } from '../dtos/wallet.dto';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { RolesEnum } from '../../shared/enums/roles.enum';
import { Roles } from '../../shared/decorators/roles.decorator';

@Controller({ version: ['1'], path: 'wallets' })
@ApiTags('Wallets')
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @Get('')
  public listAll() {
    return this.walletService.listAll();
  }

  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @Get(':id')
  public detail(@Param('id') walletId) {
    return this.walletService.getById(walletId);
  }

  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @Post('')
  public create(@GetUser() userId, @Body() w: WalletDTO) {
    return this.walletService.create(userId, w);
  }

  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @Put(':id')
  public update(
    @GetUser() userId,
    @Param('id') walletId,
    @Body() w: WalletDTO,
  ) {
    return this.walletService.update(walletId, w, userId);
  }

  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @Delete(':id')
  public delete(@Param('id') walletId) {
    return this.walletService.delete(walletId);
  }
}
