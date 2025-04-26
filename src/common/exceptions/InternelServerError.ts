import { HttpStatus } from '@nestjs/common';

import { DomainException } from '~/common/exceptions/DomainException';

export class InternalServerError extends DomainException {
  constructor(domainName: string, details?: string) {
    const message = details
      ? `Internal server error for ${domainName}: ${details}`
      : `Internal server error for ${domainName}`;
    super(domainName, message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = 'InternalServerError';
  }
}
