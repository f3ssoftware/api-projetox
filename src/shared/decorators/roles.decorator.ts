import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../guards/auth-guard.guard';
import { RolesEnum } from '../enums/roles.enum';

export const Roles = (...roles: RolesEnum[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard));
