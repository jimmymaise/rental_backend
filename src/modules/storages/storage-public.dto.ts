export interface StoragePublicDTO {
  id: string
  url: string
  signedUrl?: {
    url: string
    smallUrl: string
    mediumUrl: string
  }
}
