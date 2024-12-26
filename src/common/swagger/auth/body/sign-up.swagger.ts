import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export function ApiSignUpSwagger() {
  return applyDecorators(
    ApiBody({
      description: 'Sign up account',
      schema: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'admin' },
          password: { type: 'string', example: '123456' },
          email: { type: 'string', example: 'admin@gmail.com' },
        },
        required: ['username', 'password', 'email'],
      },
    }),
  );
}
