import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * This param decorator is used to extract User Entity from request object.
 * It must be used after Auth Guard!
 */
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.currentUser;
  },
);
