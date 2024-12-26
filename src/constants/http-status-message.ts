import { HttpStatus } from '@nestjs/common';

export const HttpStatusMessages = {
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.OK]: 'SUCCESS',
};
