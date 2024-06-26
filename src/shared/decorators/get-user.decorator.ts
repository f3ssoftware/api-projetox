import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import jwtDecode from 'jwt-decode';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();

    const token = request?.headers?.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('O token enviado é inválido');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const decoded: any = jwtDecode(token!);

    return decoded['sub'];
  },
);
