import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Train = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return {
    id: Number(req.params.id),
    user: req.user,
  };
});
