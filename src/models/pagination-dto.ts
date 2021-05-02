export interface OffsetPaginationDTO<T> {
  items: T[];
  total: number;
  offset: number | string;
  limit: number;
}
