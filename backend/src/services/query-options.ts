export type SortOrder = 'ASC' | 'DESC';

export interface ListQueryOptions {
  search?: string;
  page?: string | number;
  pageSize?: string | number;
  sortBy?: string;
  sortOrder?: string;
  [key: string]: string | number | undefined;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export const hasListQuery = (query: ListQueryOptions = {}) =>
  Object.values(query).some((value) => value !== undefined && value !== '');

export const getPagination = (query: ListQueryOptions = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const requestedPageSize = Number(query.pageSize) || 10;
  const pageSize = Math.min(Math.max(requestedPageSize, 1), 100);
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
};

export const getSortOrder = (value?: string): SortOrder =>
  value?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

export const buildPaginationMeta = (
  page: number,
  pageSize: number,
  totalItems: number,
): PaginationMeta => {
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
