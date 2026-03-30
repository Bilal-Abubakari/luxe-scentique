import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from '@luxe-scentique/shared-types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IAuthUser => {
    const request = ctx.switchToHttp().getRequest<{ user: IAuthUser }>();
    return request.user;
  },
);
