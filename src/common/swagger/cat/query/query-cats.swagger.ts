import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { paginationQuery } from 'src/constants/common';

export function ApiQueryCatsSwagger() {
  const extraQuery = [{ name: 'name', required: false, type: String, description: 'Name of cats' }];

  const allQuery = [...paginationQuery, ...extraQuery];

  return applyDecorators(...allQuery.map((query) => ApiQuery(query)));
}
