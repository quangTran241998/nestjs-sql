import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export function ApiUpdateUserInfoSwagger() {
  return applyDecorators(
    ApiBody({
      description: 'Update user info',
      schema: {
        type: 'object',
        properties: {
          password: { type: 'string', example: '123456' },
        },
        required: ['password'],
      },
    }),
  );
}
