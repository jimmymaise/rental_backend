export interface AreaDTO {
  id: string
  region: string
  name: string
  slug: string
  parentAreaId?: string
  latitude: number
  longitude: number
  order: number
  isDisabled?: boolean
  isDeleted?: boolean
}
