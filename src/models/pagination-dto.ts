export interface PaginationDTO<T> {
  items: T[]
  total: number
  offset: number|string
  limit: number
}
