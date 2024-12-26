import { PaginationQuery } from 'src/interfaces/common';

export interface CatQuery extends PaginationQuery {
  name?: string;
  breed?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
