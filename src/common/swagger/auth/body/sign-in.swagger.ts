import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export function ApiSignInSwagger() {
  return applyDecorators(
    ApiBody({
      description: 'Sign in account',
      schema: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'user' },
          password: { type: 'string', example: 'Quang123@' },
        },
        required: ['username', 'password'],
      },
    }),
  );
}
