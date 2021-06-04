import { StoragePublicDTO } from '../storages/storage-public.dto';
import { RentingMandatoryVerifyDocumentPublicDTO } from '../renting-mandatory-verify-documents/renting-mandatory-verify-document-public.dto';

export interface ItemUserInputDTO {
  sku: string;
  name: string;
  description?: string;
  termAndCondition?: string;
  categoryIds?: string[];
  orgCategoryIds?: string[];
  areaIds?: string[];
  images?: StoragePublicDTO[];
  roughAddress?: string;
  checkBeforeRentDocuments?: RentingMandatoryVerifyDocumentPublicDTO[];
  keepWhileRentingDocuments?: RentingMandatoryVerifyDocumentPublicDTO[];
  unavailableForRentDays?: number[];
  currentOriginalPrice?: number;
  sellPrice?: number;
  hidePrice?: boolean;
  rentPricePerDay?: number;
  rentPricePerWeek?: number;
  rentPricePerMonth?: number;
  note?: string;
  status?: string;
}
