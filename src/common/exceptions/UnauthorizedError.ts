import { HttpStatus } from '@nestjs/common';

import { DomainException } from '~/common/exceptions/DomainException';

export class UnauthorizedError extends DomainException {
  constructor(domainName: string, details?: string) {
    const message = details ? `Unauthorized access: ${details}` : `Unauthorized access`;
    super(domainName, message, HttpStatus.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}
