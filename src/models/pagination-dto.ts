export interface OffsetPaginationDTO<T> {
  items: T[];
  total: number;
  offset: number | string;
  limit: number;
}
export interface QueryWithOffsetPagingDTO {
  pageSize: number;
  offset: number;
  orderBy: any;
}
