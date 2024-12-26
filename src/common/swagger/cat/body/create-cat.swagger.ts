import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export function ApiCreateCatSwagger() {
  return applyDecorators(
    ApiBody({
      description: 'Create a new cat',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Meomeo' },
          breed: { type: 'string', example: 'Vn' },
          age: { type: 'number', example: 25 },
        },
        required: ['name', 'breed', 'age'],
      },
    }),
  );
}
