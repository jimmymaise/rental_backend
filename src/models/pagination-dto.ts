export interface PaginationDTO<T> {
  items: T[]
  total: number
  offset: number
  limit: number
}
