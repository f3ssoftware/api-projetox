import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import jwtDecode from 'jwt-decode';

import { RolesEnum } from './../../authentication/enums/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();

    let token: string = request?.headers?.authorization;

    if (!token?.length) throw new UnauthorizedException('Acesso negado!');

    if (token == process.env.PAGSTAR_INTERNAL_TOKEN) {
      return true;
    }

    token = token.split(' ')[1];

    let decoded: any;

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      decoded = jwtDecode(token!);
    } catch (error) {
      throw new UnauthorizedException(
        'Acesso negado! O token informado é inválido',
      );
    }

    const expiration = new Date(decoded.exp * 1000);
    const now = new Date();

    if (now > expiration) {
      throw new UnauthorizedException(
        'Acesso negado! O token informado está expirado.',
      );
    }

    const userRoles: string[] = decoded?.resource_access?.pagstar?.roles;

    let canActivate = false;

    requiredRoles.forEach((r) => {
      if (userRoles?.includes(r)) {
        canActivate = true;
      }
    });

    if (!canActivate) {
      throw new UnauthorizedException(
        'Acesso negado! O usuário não possui permissão para realizar a ação',
      );
    }

    return canActivate;
  }
}
