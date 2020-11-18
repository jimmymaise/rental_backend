import {
  Category,
  Area
} from '@prisma/client';

import { StoragePublicDTO } from '../storages/storage-public.dto'
import { RentingMandatoryVerifyDocumentPublicDTO } from '../renting-mandatory-verify-documents/renting-mandatory-verify-document-public.dto'

export interface ItemDTO {
  id: string
  name: string
  slug: string
  description?: string
  categories?: Category[]
  areas?: Area[]
  images?: StoragePublicDTO[]
  roughAddress?: string
  checkBeforeRentDocuments?: RentingMandatoryVerifyDocumentPublicDTO[]
  keepWhileRentingDocuments?: RentingMandatoryVerifyDocumentPublicDTO[]
  unavailableForRentDays?: number[]
  currentOriginalPrice?: number
  sellPrice?: number
  rentPricePerDay?: number
  rentPricePerWeek?: number
  rentPricePerMonth?: number
  note?: string
  currencyCode?: string
  summaryReviewCore?: number
  summaryReviewCount?: number
  availableQuantity?: number
  totalQuantity?: number
  isVerified?: boolean
  status: string
  createdDate: number
}
