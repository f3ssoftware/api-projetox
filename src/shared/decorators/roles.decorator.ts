import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { RolesEnum } from '../../authentication/enums/roles.enum';
import { AuthGuard } from '../guards/auth-guard.guard';

export const Roles = (...roles: RolesEnum[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard));
