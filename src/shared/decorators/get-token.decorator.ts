import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetToken = createParamDecorator(
  (data, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();

    return request?.headers?.authorization?.split(' ')[1];
  },
);
