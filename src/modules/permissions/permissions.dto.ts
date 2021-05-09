import { Transform } from 'class-transformer';

import { sanitizeHtml } from '@helpers/transforms/sanitize-html';

export class PermissionDTO {
  @Transform(sanitizeHtml)
  name: string;
  @Transform(sanitizeHtml)
  description: string;
  isInternal: boolean;
}
