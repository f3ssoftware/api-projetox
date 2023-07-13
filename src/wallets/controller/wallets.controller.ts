import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { WalletsService } from '../services/wallets.service';
import { WalletDTO } from '../dtos/wallet.dto';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { RolesEnum } from '../../shared/enums/roles.enum';
import { Roles } from '../../shared/decorators/roles.decorator';
import { WalletFilterDto } from '../dtos/wallet-filter.dto';
import { SortOrder } from 'dynamoose/dist/General';

@Controller({ version: ['1'], path: 'wallets' })
@ApiTags('Wallets')
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @Get('')
  @ApiBearerAuth()
  public listAll(@GetUser() userId, @Query() filter: WalletFilterDto) {
    return this.walletService.listAllByUser(userId, filter);
  }

  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @Get('/:id')
  @ApiBearerAuth()
  public detail(@Param('id') walletId) {
    return this.walletService.getById(walletId);
  }

  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @Post('')
  @ApiBearerAuth()
  public create(@GetUser() userId, @Body() w: WalletDTO) {
    return this.walletService.create(userId, w);
  }

  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @Put('/:id')
  @ApiBearerAuth()
  public update(
    @GetUser() userId,
    @Param('id') walletId,
    @Body() w: WalletDTO,
  ) {
    return this.walletService.update(walletId, w, userId);
  }

  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @Delete('/:id')
  @ApiBearerAuth()
  public delete(@Param('id') walletId) {
    return this.walletService.delete(walletId);
  }
}
