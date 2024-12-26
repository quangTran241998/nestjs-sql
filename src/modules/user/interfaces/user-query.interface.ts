import { PaginationQuery } from 'src/interfaces/common';

export interface UserQuery extends PaginationQuery {
  username?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
