import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { GroupFilterDto } from '../dtos/group-filter.dto';
import { GroupsService } from '../services/groups.service';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesEnum } from '../../shared/enums/roles.enum';
import { GroupDto } from '../dtos/group.dto';
import { EditGroupDto } from '../dtos/edit-group.dto';

@Controller({ version: ['1'], path: 'groups' })
@ApiTags('Groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Get(':wallet_id')
  @ApiBearerAuth()
  @ApiParam({ name: 'wallet_id', required: true, type: 'string' })
  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  public list(@Param('wallet_id') walletId, filter: GroupFilterDto) {
    return this.groupService.list(walletId, filter);
  }

  @Post(':wallet_id')
  @ApiBearerAuth()
  @ApiParam({ name: 'wallet_id', required: true, type: 'string' })
  @Roles(RolesEnum.FREE, RolesEnum.PREMIUM, RolesEnum.ADMIN)
  public create(@Param('wallet_id') walletId: string, @Body() g: GroupDto) {
    // return walletId;
    return this.groupService.create(walletId, g);
  }

  @Put('')
  public update(@Body() g: EditGroupDto) {
    return this.groupService.update(g);
  }
}
